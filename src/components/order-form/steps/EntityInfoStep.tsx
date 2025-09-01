// ============================================
// Entity/Taxpayer Information Step (Step 2)
// National 1031 Center - Order Form
// ============================================

import React, { useEffect } from 'react';
import { useOrderForm } from '../OrderFormContext';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { RadioGroup } from '../../ui/RadioGroup';

export const EntityInfoStep: React.FC = () => {
  const { formState, updateField } = useOrderForm();
  const { data, errors } = formState;
  
  // Initialize default value if not set
  useEffect(() => {
    if (!data['1031x_order_title_held_as_entity']) {
      updateField('1031x_order_title_held_as_entity', 'individual');
    }
  }, []);

  // Determine if this is an entity exchange
  const isEntity = data['1031x_order_title_held_as_entity'] === 'entity';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Entity & Taxpayer Information
        </h2>
        <p className="text-gray-600">
          Please provide information about the entity or individual conducting the exchange.
        </p>
      </div>

      {/* Title Held As */}
      <RadioGroup
        label="How is title to the property held?"
        name="1031x_order_title_held_as_entity"
        value={data['1031x_order_title_held_as_entity'] || 'individual'}
        onChange={(value) => updateField('1031x_order_title_held_as_entity', value)}
        options={[
          { value: 'individual', label: 'Individual(s)' },
          { value: 'entity', label: 'Entity (LLC, Partnership, Corporation, Trust, etc.)' }
        ]}
        error={errors['1031x_order_title_held_as_entity']}
        required
      />

      {/* Entity Information - Show only if entity is selected */}
      {isEntity && (
        <>
          {/* Entity Name */}
          <Input
            label="Entity Name"
            name="1031x_order_taxpayer_entity_name"
            type="text"
            value={data['1031x_order_taxpayer_entity_name'] || ''}
            onChange={(e) => updateField('1031x_order_taxpayer_entity_name', e.target.value)}
            placeholder="e.g., ABC Properties LLC"
            error={errors['1031x_order_taxpayer_entity_name']}
            required={isEntity}
          />

          {/* Entity Representative */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Authorized Entity Representative
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Person authorized to sign documents on behalf of the entity
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="1031x_order_taxpayer_entity_rep_first_name"
                type="text"
                value={data['1031x_order_taxpayer_entity_rep_first_name'] || ''}
                onChange={(e) => updateField('1031x_order_taxpayer_entity_rep_first_name', e.target.value)}
                placeholder="First name"
                error={errors['1031x_order_taxpayer_entity_rep_first_name']}
                required={isEntity}
              />
              
              <Input
                label="Last Name"
                name="1031x_order_taxpayer_entity_rep_last_name"
                type="text"
                value={data['1031x_order_taxpayer_entity_rep_last_name'] || ''}
                onChange={(e) => updateField('1031x_order_taxpayer_entity_rep_last_name', e.target.value)}
                placeholder="Last name"
                error={errors['1031x_order_taxpayer_entity_rep_last_name']}
                required={isEntity}
              />
            </div>
            
            <div className="mt-4">
              <Input
                label="Title/Position"
                name="1031x_order_taxpayer_entity_rep_title"
                type="text"
                value={data['1031x_order_taxpayer_entity_rep_title'] || ''}
                onChange={(e) => updateField('1031x_order_taxpayer_entity_rep_title', e.target.value)}
                placeholder="e.g., Managing Member, President, Trustee"
                error={errors['1031x_order_taxpayer_entity_rep_title']}
                required={isEntity}
              />
            </div>
          </div>

          {/* EIN */}
          <Input
            label="Entity EIN (Employer Identification Number)"
            name="1031x_order_taxpayer_ein2"
            type="text"
            value={data['1031x_order_taxpayer_ein2'] || ''}
            onChange={(e) => updateField('1031x_order_taxpayer_ein2', e.target.value)}
            placeholder="XX-XXXXXXX"
            error={errors['1031x_order_taxpayer_ein2']}
            helperText="Federal tax identification number for the entity"
          />
        </>
      )}

      {/* SSN for Individuals */}
      {!isEntity && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg 
              className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">
                Tax Identification Information
              </h4>
              <p className="text-sm text-blue-800">
                Your Social Security Number (SSN) will be collected securely later in the process 
                when exchange documents are prepared. It is not required at this time.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Additional Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Important Notes
        </h3>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>
            The entity or individual listed here must be the same as shown on the property title
          </li>
          <li>
            For entities, ensure the representative has legal authority to sign
          </li>
          <li>
            Multiple entities or complex ownership structures may require additional documentation
          </li>
        </ul>
      </div>
    </div>
  );
};