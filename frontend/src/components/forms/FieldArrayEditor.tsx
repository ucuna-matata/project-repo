import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';
import type { Control } from 'react-hook-form';
/* eslint-disable @typescript-eslint/no-explicit-any */

interface Field {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'date';
  placeholder?: string;
  required?: boolean;
}

interface FieldArrayEditorProps {
  control: Control<any>;
  name: string;
  fields: Field[];
  title: string;
  defaultValue: any;
}

export function FieldArrayEditor({ control, name, fields, title, defaultValue }: FieldArrayEditorProps) {
  const { fields: items, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button
          type="button"
          onClick={() => append(defaultValue)}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </button>
      </div>

      {items.map((item, index) => (
        <div key={item.id} className="bg-gray-50 p-4 rounded-lg space-y-3 relative">
          <button
            type="button"
            onClick={() => remove(index)}
            className="absolute top-2 right-2 text-red-600 hover:text-red-700"
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  {...(control.register as any)(`${name}.${index}.${field.name}`)}
                  rows={3}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder={field.placeholder}
                />
              ) : (
                <input
                  {...(control.register as any)(`${name}.${index}.${field.name}`)}
                  type={field.type || 'text'}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}
        </div>
      ))}

      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          <p>No {title.toLowerCase()} added yet.</p>
          <p className="text-sm mt-1">Click "Add" to create your first entry.</p>
        </div>
      )}
    </div>
  );
}
