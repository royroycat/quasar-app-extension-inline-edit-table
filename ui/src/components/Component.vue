<template>
    <q-table bordered :columns="columns" :rows="rows">
        <template v-slot:body="props">
            <q-tr>
                <q-td v-for="col in props.cols" :key="col.name" :align="col.align">
                    <template v-if="col.name === 'action'">
                        <slot name="action">
                            <q-btn round size="xs" color="primary" icon="remove" @click="removeRow(props.row)" />
                            <q-btn v-if="isEditing.status == false" class="q-ml-sm" round size="xs" color="primary"
                                icon="edit" @click="editRow(props.row)" />
                            <q-btn v-else-if="isEditing.status == true && isEditing.row == props.row" class="q-ml-sm" round
                                size="xs" color="primary" icon="check" @click="confirmRow(props.row)" />
                        </slot>
                        <slot name="more-action" v-bind:row="props.row"></slot>
                    </template>
                    <!-- isEditing.status is true, display q-input, then: -->
                    <template
                        v-else-if="col.type === 'number' && isEditing.status == true && col.editable == true && isEditing.row == props.row">
                        <q-input type="number" outlined :model-value="isEditing.editedValues[col.name]"
                            @update:model-value="(value) => isEditing.editedValues[col.name] = parseFloat(value)"></q-input>
                    </template>
                    <template
                        v-else-if="col.type === 'string' && isEditing.status == true && col.editable == true && isEditing.row == props.row">
                        <q-input type="string" outlined v-model="isEditing.editedValues[col.name]"></q-input>
                    </template>
                    <template
                        v-else-if="col.type == 'percentage' && isEditing.status == true && col.editable == true && isEditing.row == props.row">
                        <q-input type="number" outlined :model-value="isEditing.editedValues[col.name] * 100"
                            @update:model-value="(value) => isEditing.editedValues[col.name] = value / 100"></q-input>
                    </template>

                    <!-- isEditing.status is false, just display the value, then: -->
                    <template v-else-if="col.type === 'string'">
                        {{ (col.value) }}
                    </template>
                    <template v-else-if="col.type === 'number' && col.value != null">
                        {{ (col.value).toFixed(col.decimalPlaces) }}
                    </template>
                    <template v-else-if="col.type === 'percentage' && col.value != null">
                        {{ (col.value * 100).toFixed(col.decimalPlaces) }}%
                    </template>
                </q-td>
            </q-tr>
        </template>

        <!-- for createRow UI -->
        <template v-slot:bottom-row="props">
            <q-tr>
                <q-td v-for="col in props.cols" :key="col.name">
                    <template v-if="col.name === 'action'">
                        <q-btn round dense size="xs" color="primary" icon="add" @click="createRow()" />
                    </template>
                    <template v-else-if="col.requireWhenCreate == true && col.type === 'string'">
                        <q-input outlined dense type="text" v-model="creatingValues[col.name]" />
                    </template>
                    <template v-else-if="col.requireWhenCreate == true && col.type === 'number'">
                        <q-input outlined dense type="number" :model-value="creatingValues[col.name]?creatingValues[col.name]:creatingValues[col.name]=0"
                            @update:model-value="(value) => creatingValues[col.name] = parseFloat(value)" />
                    </template>
                    <template v-else-if="col.requireWhenCreate == true && col.type === 'percentage'">
                        <q-input outlined dense type="number" :model-value="creatingValues[col.name]?creatingValues[col.name] * 100:creatingValues[col.name]=0"
                            @update:model-value="(value) => creatingValues[col.name] = value / 100"></q-input>
                    </template>
                </q-td>
            </q-tr>
        </template>

        <!-- the following is for passing q-table slots from parent q-inline-edit-table tag, so can remain support back the q-table slots -->
        <template v-for="(_, name) in $slots" v-slot:[name]="slotProps">
            <slot v-if="slotProps" :name="name" v-bind="slotProps" />
            <slot v-else :name="name" />
        </template>

    </q-table>
</template>
  
<script>
import { ref } from 'vue';
export default {
    name: "QInlineEditTable",
    emits: ['removeRow','editRow','confirmRow','createRow'],
    props: {
        columns: {
            type: Array,
            required: true
        },
        rows: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            props: {},
            isEditing: { status: false, row: null, editedValues: {} },
            creatingValues: {}
        }
    },
    mounted() {
        // columns pass from parent and it is a proxy array, i.e. already a ref object, just manipulate it will reflect the reactive ui
        this.columns.unshift({ name: 'action', label: 'action', align: 'left' })
    },
    methods: {
        resetEditingAndCreatingData() {
            this.isEditing.status = false
            this.isEditing.row = null
            this.isEditing.editedValues = {}
            this.creatingValues = {}
        },
        removeRow(thisRow) {
            console.log("removeRow event emitted")
            console.log("proxy row : ", thisRow)
            this.$emit('removeRow', thisRow);
            // reflect the table ui
            const index = this.rows.indexOf(thisRow);
            this.rows.splice(index, 1);
        },
        editRow(thisRow) {
            console.log("editRow event emitted")
            console.log("proxy row : ", thisRow)
            this.isEditing.status = true
            this.isEditing.row = thisRow
            // copy row field value for v-model editedValue
            this.isEditing.editedValues = { ...thisRow }

            this.$emit('editRow', thisRow);
        },
        confirmRow(thisRow) {
            console.log("confirmRow event emitted:")
            this.isEditing.status = false
            // Copy the editedValues to a object for manipulation 
            let newValues = { ...this.isEditing.editedValues }

            console.log("proxy row : ", thisRow, "new Values : ", newValues)
            this.$emit('confirmRow', thisRow, newValues);

            // reflect the table ui
            // replace the row value of that row (by index) by new value
            const index = this.rows.indexOf(thisRow);
            this.rows[index] = { ...newValues }
            this.resetEditingAndCreatingData()
        },
        createRow() {
            console.log("createRow event emitted:")
            console.log("creating Value : ", this.creatingValues)
            this.$emit('createRow', this.creatingValues)
            // reflect the table ui
            this.rows.push(this.creatingValues)
            this.resetEditingAndCreatingData()
        }
    }
}
</script>