<img src="https://img.shields.io/npm/v/quasar-ui-inline-edit-table.svg?label=quasar-ui-inline-edit-table">
<img src="https://img.shields.io/npm/v/quasar-app-extension-inline-edit-table.svg?label=quasar-app-extension-inline-edit-table">

<img src="https://github.com/royroycat/quasar-app-extension-inline-edit-table/assets/5573927/576fdb33-0456-4b3a-8100-25dda04a074f" width="500">

Compatible with Quasar UI v2 and Vue 3.

# Structure
* [/ui](ui) - standalone npm package

* [/app-extension](app-extension) - Quasar app extension

# Usage
```vue
<template>
    <div>
      <q-inline-edit-table bordered :loading="loading" :rows="rows" :columns="columns" :hide-pagination="true" row-key="name"
          :rows-per-page-options="[0]" no-data-label="☝️ No data. Please add an entry. ☝️">
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
                { name: "name", label:"name" , field: "name", type: 'string', editable:true, align:'left'},
                { name: "amount", label:"amount" , field: "amount", type: 'number', editable:true, decimalPlaces:2, align:'left'},
            ],
            rows: [{name:"Apple", amount:10}, {name:"Orange", amount:20}]
        }
    },}
</script>
```

Actually it is a q-table wrapper, the props are the same as q-table.

Type / editable / decimalPlaces (for type: 'number') need to be filled.

# License
MIT (c) royroycat
