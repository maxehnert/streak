<template>
  <form @submit.prevent='updateProjectClick' class='settings-group'>
    <h3>{{formTitle}}</h3>
    <div class='secondary'>
      Configure what information you want to capture. Each field becomes
      an input box when you add records to your project.
    </div>
    <div>
      <field-pair v-for='field in currentFields' :field='field' @remove='removeField' :focused='field === focusedField' :readonly='loading'></field-pair>
      <a @click.prevent='addField' class='add-field' href='#' v-if='canAddMore && !loading'>Add field</a>
    </div>

    <slot :hasError='hasError'>
      <div>
        <ui-button type='secondary' color='primary' buttonType='submit' :disabled='hasError' v-if='!loading'>
          {{formName}}
        </ui-button>
        <div v-if='loading'>
          <ui-icon-button icon='refresh' :loading='true' type='secondary'></ui-icon-button> Updating...
        </div>
      </div>
    </slot>
    <div v-if='hasError'>
      <div v-for='error in errors' class='error'>&gt; {{error}}</div>
    </div>
  </form>
</template>

<script>
import UiButton from 'keen-ui/src/UiButton';
import UiIconButton from 'keen-ui/src/UiIconButton';

import FieldPair from './FieldPair.vue';
import { TEXT, DATE, getFieldByType } from '../../types/FieldTypes.js';

// We limit it to 26 because sheetOpartions.js assumes range names can anly be
// within engilsih alphabet. This is soft limit and can be easily changed.
const MAX_COLUMNS = 26;

export default {
  name: 'ProjectStructure',
  props: {
    fields: Array,
    loading: {
      type: Boolean,
      default: false
    },
    formTitle: {
      type: String,
      default: 'Project structure'
    }
  },
  components: {
    FieldPair,
    UiButton,
    UiIconButton
  },
  watch: {
    fields(newFields) {
      this.currentFields = cloneFields(newFields);
    },
  },
  data() {
    return {
      // should be props
      formName: 'Update project structure',
      currentFields: cloneFields(this.fields),
      focusedField: null
    };
  },
  computed: {
    canAddMore() {
      return this.currentFields.length < MAX_COLUMNS;
    },

    hasError() {
      return this.errors.length > 0;
    },

    errors() {
      const foundErrors = [];
      const nameToField = new Map();

      let hasDate = false;
      let nameIsRequired = false;
      let duplicateNames = false;

      this.currentFields.forEach(f => {
        if (f.type === DATE) hasDate = true;
        if (!f.title) {
          f.error = true;
          nameIsRequired = true;
        } else {
          const fieldTitle = f.title.toLowerCase();
          const fieldWithTheSameTitle = nameToField.get(fieldTitle);
          if (fieldWithTheSameTitle) {
            duplicateNames = true;
            fieldWithTheSameTitle.error = true;
            f.error = true;
          } else {
            f.error = false;
          }

          nameToField.set(fieldTitle, f);
        }
      });

      if (!hasDate) {
        foundErrors.push('At least one date field is required');
      }
      if (nameIsRequired) {
        foundErrors.push('Name is required for all fields');
      }
      if (duplicateNames) {
        foundErrors.push('All fields should have a unique name');
      }

      return foundErrors;
    },
  },
  methods: {
    updateProjectClick() {
      this.$emit('updated', this.currentFields);
    },

    addField() {
      const field = {
        title: '',
        error: false,
        type: TEXT
      };
      this.currentFields.push(field);
      this.focusedField = field;
    },

    removeField(field) {
      const idxToRemove = this.currentFields.indexOf(field);
      if (idxToRemove < 0) throw new Error('Wrong index to remove');

      this.currentFields.splice(idxToRemove, 1);
    }
  }
};

function cloneFields(fields) {
  if (!fields) return [];

  return fields.map((f, idx) => ({
    // UI is bound to this title and can modify it
    title: f.title,
    // To update modified fields, we preserve the original title here:
    originalTitle: f.title,
    // If this field has error, we set this to true.
    error: false,
    // Finally, this is a value for the drop down.
    type: getFieldByType(f.valueType),

    columnIndex: idx
  }));
}
</script>

<style lang='stylus'>
@import '../../styles/variables.styl';

.error {
  color: error-color;
}
.add-field {
  height: 82px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid strong-border-color;
  margin-top: 14px;
  margin-bottom: 14px;
}
</style>
