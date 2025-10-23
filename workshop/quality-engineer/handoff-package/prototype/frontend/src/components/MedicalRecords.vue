<template>
  <section class="medical-records" aria-live="polite">
    <h3>Medical records</h3>

    <div v-if="loading" class="loading">Loading medical records…</div>

    <div v-else-if="error" class="error" role="alert">
      Error loading medical records: {{ error }}
    </div>

    <div v-else>
      <div v-if="recordsList.length === 0" class="empty-state">No records yet.</div>

      <ul v-else class="records-list">
        <li
          v-for="record in recordsList"
          :key="record.id"
          class="record-item"
        >
          <!-- Edit Mode -->
          <div v-if="editingRecord?.id === record.id" class="record-edit">
            <div class="field">
              <label for="edit-notes">Notes</label>
              <textarea
                id="edit-notes"
                v-model="editingRecord.notes"
                rows="3"
                aria-label="Medical record notes"
              ></textarea>
            </div>
            <div class="field">
              <label for="edit-vet">Vet</label>
              <input
                id="edit-vet"
                v-model="editingRecord.vet"
                type="text"
                aria-label="Veterinarian name"
              />
            </div>
            <div class="field">
              <label for="edit-date">Date</label>
              <input
                id="edit-date"
                v-model="editingRecord.date"
                type="date"
                aria-label="Medical record date"
              />
            </div>
            <div class="field">
              <label for="edit-type">Type</label>
              <select
                id="edit-type"
                v-model="editingRecord.type"
                aria-label="Medical record type"
              >
                <option value="note">Note</option>
                <option value="vaccination">Vaccination</option>
                <option value="check-up">Check-up</option>
                <option value="treatment">Treatment</option>
              </select>
            </div>
            <div class="actions">
              <button
                @click="saveEdit"
                class="btn-primary"
                aria-label="Save changes to medical record"
              >
                Save
              </button>
              <button
                @click="cancelEdit"
                class="btn-secondary"
                aria-label="Cancel editing medical record"
              >
                Cancel
              </button>
            </div>
          </div>

          <!-- View Mode -->
          <div v-else class="record-view">
            <div class="record-header">
              <strong>{{ record.type }}</strong> — {{ record.notes }}
            </div>
            <div class="record-meta">
              {{ record.vet }} • {{ formatDate(record.date) }}
            </div>
            <div class="record-actions">
              <button
                @click="startEdit(record)"
                class="btn-edit"
                aria-label="Edit this medical record"
              >
                Edit
              </button>
              <button
                @click="confirmDelete(record)"
                class="btn-delete"
                aria-label="Delete this medical record"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      </ul>

      <!-- Add New Record Form -->
      <div class="add-record">
        <h4>Add record</h4>
        <form @submit.prevent="addRecord" class="add-form">
          <div class="field">
            <label for="new-notes">Notes</label>
            <textarea
              id="new-notes"
              v-model="newRecord.notes"
              rows="3"
              required
              aria-label="New medical record notes"
            ></textarea>
          </div>
          <div class="field">
            <label for="new-vet">Vet</label>
            <input
              id="new-vet"
              v-model="newRecord.vet"
              type="text"
              required
              aria-label="Veterinarian name"
            />
          </div>
          <div class="field">
            <label for="new-date">Date</label>
            <input
              id="new-date"
              v-model="newRecord.date"
              type="date"
              required
              aria-label="Medical record date"
            />
          </div>
          <div class="field">
            <label for="new-type">Type</label>
            <select
              id="new-type"
              v-model="newRecord.type"
              required
              aria-label="Medical record type"
            >
              <option value="note">Note</option>
              <option value="vaccination">Vaccination</option>
              <option value="check-up">Check-up</option>
              <option value="treatment">Treatment</option>
            </select>
          </div>
          <div class="actions">
            <button
              type="submit"
              class="btn-primary"
              :disabled="isSubmitting"
              aria-label="Add a new medical record"
            >
              {{ isSubmitting ? 'Adding...' : 'Add Record' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useMedicalRecordsStore, useUIStore } from '@/stores';

const props = defineProps({
  petId: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['record-added', 'record-updated', 'record-deleted']);

const medicalRecordsStore = useMedicalRecordsStore();
const uiStore = useUIStore();

const { records, loading, error } = storeToRefs(medicalRecordsStore);

const editingRecord = ref(null);
const isSubmitting = ref(false);

const recordsList = computed(() => records.value);

const newRecord = ref({
  notes: '',
  vet: '',
  date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
  type: 'note'
});

// Format date for display
function formatDate(dateString) {
  if (!dateString) return 'Unknown date';
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateString));
  } catch (err) {
    return 'Invalid date';
  }
}

// Load medical records when component mounts
onMounted(async () => {
  try {
    await medicalRecordsStore.fetchMedicalRecords(props.petId);
  } catch (err) {
    uiStore.showError('Failed to load medical records');
  }
});

function startEdit(record) {
  editingRecord.value = { ...record };
}

function cancelEdit() {
  editingRecord.value = null;
}

async function saveEdit() {
  if (!editingRecord.value) return;

  try {
    const updated = await medicalRecordsStore.updateMedicalRecord(
      props.petId,
      editingRecord.value.id,
      editingRecord.value
    );
    editingRecord.value = null;
    uiStore.showSuccess('Medical record updated successfully');
    emit('record-updated', updated);
  } catch (err) {
    uiStore.showError(err?.message || 'Failed to update medical record');
  }
}

async function confirmDelete(record) {
  if (!confirm('Are you sure you want to delete this medical record?')) return;

  try {
    await medicalRecordsStore.deleteMedicalRecord(props.petId, record.id);
    uiStore.showSuccess('Medical record deleted successfully');
    emit('record-deleted', record.id);
  } catch (err) {
    uiStore.showError(err?.message || 'Failed to delete medical record');
  }
}

async function addRecord() {
  if (isSubmitting.value) return;

  isSubmitting.value = true;
  try {
    const record = await medicalRecordsStore.createMedicalRecord(props.petId, newRecord.value);
    newRecord.value = {
      notes: '',
      vet: '',
      date: new Date().toISOString().split('T')[0],
      type: 'note'
    };
    uiStore.showSuccess('Medical record added successfully');
    emit('record-added', record);
  } catch (err) {
    uiStore.showError(err?.message || 'Failed to add medical record');
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.medical-records {
  margin-top: 1.5rem;
}

.medical-records h3 {
  margin: 0 0 1rem 0;
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
}

.loading,
.error,
.empty-state {
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.loading {
  background: #f9fafb;
  color: #6b7280;
}

.error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.empty-state {
  background: #f9fafb;
  color: #6b7280;
  border: 1px solid #e5e7eb;
}

.records-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.record-item {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
}

.record-edit,
.record-view {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.record-header {
  font-size: 0.95rem;
  line-height: 1.4;
}

.record-meta {
  font-size: 0.85rem;
  color: #6b7280;
}

.record-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.field label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

input,
select,
textarea {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

input:focus,
select:focus,
textarea:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn-primary {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: #3b82f6;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-secondary:hover {
  background: #f9fafb;
}

.btn-edit {
  padding: 0.25rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  color: #374151;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-edit:hover {
  background: #f9fafb;
}

.btn-delete {
  padding: 0.25rem 0.75rem;
  border: none;
  border-radius: 4px;
  background: #dc2626;
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-delete:hover {
  background: #b91c1c;
}

.add-record {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.add-record h4 {
  margin: 0 0 1rem 0;
  color: #1f2937;
  font-size: 1.125rem;
  font-weight: 600;
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 640px) {
  .record-actions {
    flex-direction: column;
  }

  .actions {
    flex-direction: column;
  }
}
</style>