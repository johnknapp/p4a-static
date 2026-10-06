<script setup lang="ts">
import { ref, computed } from 'vue'
import { createMultiStepPlugin } from '@formkit/addons'

const isSubmitted = ref(false)
const interests = ref<string[]>([])
const interestOther = ref(false)
const interestsString = computed(() => interests.value.join(', '))

const interestOptions = [
  'Help improve P4A',
  'Help develop better solutions to civic problems',
  'Get an early look at new features',
  'Learn more about civic technology and product development',
  'Apply my skills to something meaningful',
  'Other'
]

const toggleInterest = (option: string) => {
  const index = interests.value.indexOf(option)
  if (index > -1) {
    interests.value.splice(index, 1)
    if (option === 'Other') interestOther.value = false
  } else {
    interests.value.push(option)
    if (option === 'Other') interestOther.value = true
  }
}

const submitForm = async (formData: any) => {
  console.log('=== INSIDERS FORM SUBMISSION START ===')
  console.log('Raw FormKit data:', formData)

  try {
    const stepData = Object.values(formData)[0] as any

    const interestList = interests.value.map(i => i === 'Other' ? 'Other' : i)

    const airtablePayload = {
      fields: {
        'First name': stepData.about_you?.first_name || '',
        'Last name': stepData.about_you?.last_name || '',
        'Email': stepData.about_you?.email || '',
        'LinkedIn': stepData.about_you?.linkedin || '',
        'Referred by': stepData.about_you?.referred_by || '',
        'Interests': interestList,
        'Other interest': stepData.your_interest?.interestOtherText || '',
        'Additional notes': stepData.your_interest?.notes || ''
      }
    }

    console.log('Airtable payload:', JSON.stringify(airtablePayload, null, 2))

    const baseId = import.meta.env.PUBLIC_AIRTABLE_INSIDERS_BASE_ID
    const tableName = import.meta.env.PUBLIC_AIRTABLE_INSIDERS_TABLE_NAME
    const apiKey = import.meta.env.PUBLIC_AIRTABLE_API_ACCESS_KEY_Q226

    const airtableUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`

    const response = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(airtablePayload)
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Airtable submission error:', error)
      alert('There was an error submitting your form. Please try again.')
      return
    }

    const result = await response.json()
    console.log('Airtable submission successful:', result)
    console.log('=== INSIDERS FORM SUBMISSION END ===')

    isSubmitted.value = true

  } catch (error) {
    console.error('Network error:', error)
    console.log('=== INSIDERS FORM SUBMISSION END ===')
    alert('There was an error submitting your form. Please check your connection and try again.')
  }
}
</script>

<template>
  <div>
    <div v-if="isSubmitted" class="text-center py-12">
      <h2 class="text-3xl font-bold text-p4a-ink mb-4">Thank you!</h2>
      <p class="text-lg">We've received your application and will be in touch soon.</p>
    </div>

    <FormKit
      v-if="!isSubmitted"
      type="form"
      @submit="submitForm"
      :plugins="[createMultiStepPlugin()]"
      :actions="false"
    >
      <FormKit
        type="multi-step"
        :allow-incomplete="true"
        tab-style="progress"
      >
        <p class="text-sm mb-6 text-center text-p4a-faint">All entries are required unless marked optional</p>

        <!-- Step 1: Your interest -->
        <FormKit type="step" name="your_interest" label="Your interest">

          <!-- Interests checkboxes -->
          <fieldset class="mb-8 p-4 border border-p4a-body-text rounded-lg">
            <legend class="px-2 font-semibold text-p4a-subtle">What interests you about becoming a P4A Insider?</legend>
            <p class="text-sm mb-4">Select all that apply</p>
            <div class="space-y-2">
              <label
                v-for="option in interestOptions"
                :key="option"
                class="flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  :value="option"
                  :checked="interests.includes(option)"
                  @change="toggleInterest(option)"
                  class="w-5 h-5 mr-3 shrink-0"
                />
                <span class="text-p4a-subtle">{{ option }}</span>
              </label>
            </div>

            <FormKit
              v-if="interestOther"
              type="text"
              name="interestOtherText"
              placeholder="Please specify"
              validation="required"
              :classes="{
                outer: 'mt-3',
                inner: 'mt-1',
                input: 'py-2'
              }"
            />
          </fieldset>

          <!-- Hidden field — blocks step advancement until at least one interest is selected -->
          <FormKit
            type="hidden"
            name="interests"
            v-model="interestsString"
            validation="required"
            :validation-messages="{ required: 'Please select at least one option.' }"
          />

          <!-- Notes -->
          <FormKit
            type="textarea"
            name="notes"
            label="Anything else you'd like us to know?"
            placeholder="Optional"
            rows="4"
            :classes="{
              outer: 'mb-8',
              help: '!text-p4a-body-text',
              fieldset: 'border border-p4a-body-text rounded-lg p-4',
              legend: 'px-2 font-semibold text-p4a-subtle',
              inner: 'mt-1',
              input: 'py-2'
            }"
          />
        </FormKit>

        <!-- Step 2: About you -->
        <FormKit type="step" name="about_you" label="About you">

          <FormKit
            type="text"
            name="first_name"
            label="First name"
            validation="required"
            :classes="{
              outer: 'mb-8',
              fieldset: 'border border-p4a-body-text rounded-lg p-4',
              legend: 'px-2 font-semibold text-p4a-subtle',
              inner: 'mt-1',
              input: 'py-2'
            }"
          />

          <FormKit
            type="text"
            name="last_name"
            label="Last name"
            validation="required"
            :classes="{
              outer: 'mb-8',
              fieldset: 'border border-p4a-body-text rounded-lg p-4',
              legend: 'px-2 font-semibold text-p4a-subtle',
              inner: 'mt-1',
              input: 'py-2'
            }"
          />

          <FormKit
            type="email"
            name="email"
            label="Email"
            validation="required|email"
            :classes="{
              outer: 'mb-8',
              fieldset: 'border border-p4a-body-text rounded-lg p-4',
              legend: 'px-2 font-semibold text-p4a-subtle',
              inner: 'mt-1',
              input: 'py-2'
            }"
          />

          <FormKit
            type="url"
            name="linkedin"
            label="LinkedIn profile URL"
            placeholder="Optional"
            validation="url"
            :classes="{
              outer: 'mb-8',
              help: '!text-p4a-body-text',
              fieldset: 'border border-p4a-body-text rounded-lg p-4',
              legend: 'px-2 font-semibold text-p4a-subtle',
              inner: 'mt-1',
              input: 'py-2'
            }"
          />

          <FormKit
            type="text"
            name="referred_by"
            label="Who referred you?"
            placeholder="Optional — person or organization"
            :classes="{
              outer: 'mb-8',
              help: '!text-p4a-body-text',
              fieldset: 'border border-p4a-body-text rounded-lg p-4',
              legend: 'px-2 font-semibold text-p4a-subtle',
              inner: 'mt-1',
              input: 'py-2'
            }"
          />

          <template #stepNext>
            <FormKit
              type="submit"
              label="Submit Application"
            />
          </template>
        </FormKit>

      </FormKit>
    </FormKit>
  </div>
</template>

<style scoped>
/* Force Jost font family on FormKit elements */
:deep(.formkit-outer),
:deep(.formkit-wrapper),
:deep(.formkit-inner),
:deep(input),
:deep(textarea),
:deep(label),
:deep(button),
:deep(h3),
:deep(p) {
  font-family: "Jost", system-ui, -apple-system, sans-serif !important;
}
</style>
