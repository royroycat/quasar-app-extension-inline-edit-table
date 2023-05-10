<template>
    <q-table bordered :columns="columns" :rows="rows" :props="props">
        <template v-slot:body="props">
            <q-tr :props="props">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">

                    <template v-if="col.name === 'action'">
                        <slot name="action">
                            <q-btn round size="xs" color="primary" icon="remove" @click="removeRow(props.row)" />
                            <q-btn v-if="isEditing.status == false" class="q-ml-sm" round size="xs" color="primary"
                                icon="edit" @click="editRow(props.row)" />
                            <q-btn v-else-if="isEditing.status == true && isEditing.row == props.row" class="q-ml-sm" round
                                size="xs" color="primary" icon="check" @click="confirmRow(props.row)" />
                        </slot>
                        <slot name="more-action"></slot>
                    </template>
                    <!-- isEditing.status is true, display q-input, then: -->
                    <template
                        v-else-if="col.type === 'number' && isEditing.status == true && col.editable == true && isEditing.row == props.row">
                        <q-input type="number" outlined v-model="isEditing.editedValue[col.name]"
                            :value="col.value.toFixed(col.decimalPlaces)"></q-input>
                    </template>
                    <template
                        v-else-if="col.type === 'string' && isEditing.status == true && col.editable == true && isEditing.row == props.row">
                        <q-input type="string" outlined v-model="isEditing.editedValue[col.name]"
                            :value="col.value"></q-input>
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
    </q-table>
</template>
  
<script>
import { ref } from 'vue';
export default {
    name: "QInlineEditTable",
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
            isEditing: { status: false, row: null, editedValue: {} }
        }
    },
    mounted() {
        // columns pass from parent and it is a proxy array, i.e. already a ref object, just manipulate it will reflect the reactive ui
        this.columns.unshift({ name: 'action', label: 'action', align: 'left' })
    },
    methods: {
        resetEditingData() {
            this.isEditing.status = false
            this.isEditing.row = null
            this.isEditing.editedValue = {}
        },
        removeRow(thisRow) {
            console.log("removeRow event emitted")
            console.log("proxy row : ", thisRow)
            this.$emit('removeRow', thisRow);
            const index = this.rows.indexOf(thisRow);
            this.rows.splice(index, 1);
        },
        editRow(row) {
            console.log("editRow event emitted")
            console.log("proxy row : ", row)
            this.isEditing.status = true
            this.isEditing.row = row
            // copy row field value for v-model editedValue
            this.isEditing.editedValue = { ...row }
            this.$emit('editRow', row);
        },
        confirmRow(thisRow) {
            console.log("confirmRow event emitted:")
            this.isEditing.status = false
            // Copy the editedValue to a object for manipulation 
            let newValuesItem = { ...this.isEditing.editedValue }

            // Since q-input will return a string whatever the type, 
            // so ask columns to find out the property type, if number then parseFloat
            newValuesItem = Object.keys(newValuesItem).reduce((acc, propName) => {
                const column = this.columns.find((col) => col.name === propName);
                if (column && column.type === 'number') {
                    acc[propName] = parseFloat(newValuesItem[propName]);
                } else {
                    acc[propName] = newValuesItem[propName];
                }
                return acc;
            }, {});

            console.log("proxy row : ", thisRow, "new Values : ", newValuesItem)
            this.$emit('confirmRow', thisRow, newValuesItem);
            // replace the row value of that row (by index) by new value
            const index = this.rows.indexOf(thisRow);
            this.rows[index] = { ...newValuesItem }
            this.resetEditingData()
        }
    }
}
</script>