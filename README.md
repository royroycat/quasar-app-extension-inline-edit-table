<img src="https://img.shields.io/npm/v/quasar-ui-inline-edit-table.svg?label=quasar-ui-inline-edit-table">
<img src="https://img.shields.io/npm/v/quasar-app-extension-inline-edit-table.svg?label=quasar-app-extension-inline-edit-table">

<img src="https://github.com/royroycat/quasar-app-extension-inline-edit-table/assets/5573927/576fdb33-0456-4b3a-8100-25dda04a074f" width="500">

Compatible with Quasar UI v2 and Vue 3.

Please give a star if you enjoy the extension.

The most important file just only one:
[ui/src/components/Component.vue](https://github.com/royroycat/quasar-app-extension-inline-edit-table/blob/main/ui/src/components/Component.vue)

I just share the idea to you. And you may fork and copy the file whatever you want.

# Structure
* [/ui](ui) - standalone npm package

* [/app-extension](app-extension) - Quasar app extension

# Install

`quasar ext add inline-edit-table`

Quasar CLI will retrieve it from NPM and install the extension.

# Uninstall

`quasar ext remove inline-edit-table`



# Usage
```vue
<template>
    <div>
        <q-inline-edit-table bordered :loading="loading" :rows="rows" :columns="columns" row-key="name" 
            :rows-per-page-options="[0]" no-data-label="☝️ No data. Please add an entry. ☝️"
            separator="vertical" @removeRow="removeRowListener" @editRow="editRowListener" @confirmRow="confirmRowListener">
        </q-inline-edit-table>
    </div>
</template>
  
<template>
    <div>
        <q-inline-edit-table bordered :loading="loading" :rows="rows" :columns="columns" row-key="name" 
            :rows-per-page-options="[0]" no-data-label="☝️ No data. Please add an entry. ☝️"
            separator="vertical" @removeRow="removeRowListener" @editRow="editRowListener" @confirmRow="confirmRowListener" @createRow="createRowListener">
        </q-inline-edit-table>
    </div>
</template>
  
<script>
export default {
    name: "TestingTable",
    data() {
        return {
            loading: false,
            columns: [
                { name: "name", label: "name", field: "name", type: 'string', editable: true, requireWhenCreate: true, align: 'left' },
                { name: "price", label: "price", field: "price", type: 'number', editable: true, requireWhenCreate: true, decimalPlaces: 2, align: 'left' },
                { name: "percent", label: "percent", field: "percent", type: 'percentage', editable: true, requireWhenCreate: true, decimalPlaces: 2, align: 'left' },
            ],
            rows: [{ name: "Apple", price: 15, percent: 0.6 }, { name: "Orange", price: 10, percent: 0.2 }]
        }
    },
    methods: {
        editRowListener(row) {
            console.log("editRow event received")
        },
        removeRowListener(row) {
            console.log("removeRow event received")
        },
        confirmRowListener(row, newValue) {
            console.log("confirmRow event received")
        },
        createRowListener(value) {
            console.log("createRow event received")
        }
    }
}
</script>
```

Actually it is a q-table wrapper, the props are the same as q-table.

And if you adding slot, it will pass to q-table too. So you can simply make use of q-table slot.


Important:
1. The name of column must be SAME as your field of your data.
2. v-slot:body and v-slot:bottom-row of q-table is prohibited; since the inline-edit-table has make use of these 2 slots already


Emit Event:
- removeRow(row)
- editRow(row)
- confirmRow(row, newValue)


Type:
- string
- number
- percentage (show as XX% , but save as 0.XX)

Editable:
- editable: true (if you want the field appear as q-input when enter edit mode)

Create Entry in bottom-row:
- requireWhenCreate: true

# License
MIT (c) royroycat
