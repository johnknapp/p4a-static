<script setup lang="ts">
import { ref, computed } from 'vue'
import { createMultiStepPlugin } from '@formkit/addons'

const isSubmitted = ref(false)
const followupMode = ref('')
const showFollowupEmail = computed(() => followupMode.value === 'Provide email for follow-up')

const categoryOptions = [
  {
    group: 'Government',
    options: [
      'Elections and campaign finance',
      'Ethics and accountability',
      'Taxes',
      'Spending and budgets',
      'Regulatory systems',
      'Government modernization'
    ]
  },
  {
    group: 'Communities',
    options: [
      'Schools',
      'Housing',
      'Community and culture',
      'Public safety',
      'Small business',
      'Local zoning'
    ]
  },
  {
    group: 'Economy',
    options: [
      'Transportation and infrastructure',
      'Energy and environment',
      'Health and care systems',
      'Workforce and education',
      'Technology and industry',
      'Innovation and science'
    ]
  },
  'Not sure'
]

const submitForm = async (formData: any) => {
  console.log('=== FORM SUBMISSION START ===')
  console.log('Raw FormKit data:', formData)

  try {
    // Extract data from nested FormKit structure
    const stepData = Object.values(formData)[0] as any

    console.log('Step 1 - The Problem:')
    console.log('  problem_text:', stepData.the_problem?.problem_text)
    console.log('  location_scope_text:', stepData.the_problem?.location_scope_text)
    console.log('  category_focus_area:', stepData.the_problem?.category)
    console.log('  affected_parties_text:', stepData.the_problem?.affected_parties_text)

    console.log('Step 2 - Context:')
    console.log('  responsible_party:', stepData.context?.responsible_party)
    console.log('  occurred_time_text:', stepData.context?.occurred_time_text)

    console.log('Step 3 - Details:')
    console.log('  observations_text:', stepData.details?.observations_text)
    console.log('  why_it_matters_text:', stepData.details?.why_it_matters_text)
    console.log('  supporting_links:', stepData.details?.supporting_links)
    console.log('  other_notes:', stepData.details?.other_notes)

    console.log('Step 4 - Privacy & review:')
    console.log('  is_emergency_confirm:', stepData.privacy_and_review?.is_emergency_confirm)
    console.log('  good_faith_confirm:', stepData.privacy_and_review?.good_faith_confirm)
    console.log('  followup_mode:', stepData.privacy_and_review?.followup_mode)
    console.log('  followup_email:', stepData.privacy_and_review?.followup_email)
    console.log('  consent_contact:', stepData.privacy_and_review?.consent_contact)
    console.log('  privacy_ack:', stepData.privacy_and_review?.privacy_ack)

    // Build payload for remote endpoint (flat structure matching backend schema)
    const payload = {
      // Step 1: The Problem
      problem_text: stepData.the_problem?.problem_text || '',
      location_scope_text: stepData.the_problem?.location_scope_text || '',
      category_focus_area: stepData.the_problem?.category || '',
      affected_parties_text: stepData.the_problem?.affected_parties_text || null,
      // Step 2: Context
      responsible_party: stepData.context?.responsible_party || null,
      occurred_time_text: stepData.context?.occurred_time_text || '',
      // Step 3: Details
      observations_text: stepData.details?.observations_text || null,
      why_it_matters_text: stepData.details?.why_it_matters_text || null,
      supporting_links: stepData.details?.supporting_links || null,
      other_notes: stepData.details?.other_notes || null,
      // Step 4: Privacy & review
      is_emergency_confirm: stepData.privacy_and_review?.is_emergency_confirm || [],
      good_faith_confirm: stepData.privacy_and_review?.good_faith_confirm || [],
      privacy_ack: stepData.privacy_and_review?.privacy_ack || [],
      followup_mode: stepData.privacy_and_review?.followup_mode || '',
      followup_email: stepData.privacy_and_review?.followup_email || null,
      consent_contact: stepData.privacy_and_review?.consent_contact || null
    }

    console.log('Structured Payload:', payload)
    console.log('Payload as JSON:', JSON.stringify(payload, null, 2))

    const endpointUrl = import.meta.env.PUBLIC_REPORT_ENDPOINT_URL
    const apiKey = import.meta.env.PUBLIC_P4A_API_KEY

    console.log('Posting to:', endpointUrl)

    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Submission error:', error)
      alert('There was an error submitting your report. Please try again.')
      console.log('=== FORM SUBMISSION END ===')
      return
    }

    const result = await response.json()
    console.log('Submission successful:', result)
    console.log('=== FORM SUBMISSION END ===')

    isSubmitted.value = true

  } catch (error) {
    console.error('Network error:', error)
    console.log('=== FORM SUBMISSION END ===')
    alert('There was an error submitting your report. Please check your connection and try again.')
  }
}
</script>

<template>
  <div>
    <div v-if="isSubmitted" class="text-center py-12">
      <h2 class="text-3xl font-bold text-p4a-ink mb-4">Thank you!</h2>
      <p class="text-lg">Your report has been submitted securely.</p>
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
        <p class="text-sm mb-6 text-center text-p4a-faint">Required unless marked optional</p>
        <!-- Step 1: The Problem -->
        <FormKit type="step" name="the_problem" label="The Problem">
          <FormKit
            type="textarea"
            name="problem_text"
            label="What's the problem?"
            validation="required|length:50,500"
            :validation-messages="{
              required: 'Please describe the problem.',
              length: 'Please provide between 50 and 500 characters.'
            }"
            placeholder="Briefly describe what is happening and why it concerns you"
            rows="4"
            :classes="{
              outer: 'mb-6',
              fieldset: 'border border-p4a-body-text rounded-lg p-4',
              legend: 'px-2 font-semibold text-p4a-subtle',
              inner: 'mt-1',
              input: 'py-2'
            }"
          />

          <FormKit
            type="text"
            name="location_scope_text"
            label="Where is this happening?"
            help="City, state, institution, community, industry, or national"
            placeholder="City, state, institution, community, industry, or national"
            validation="required|length:3,100"
            :validation-messages="{
              required: 'Please specify where this is happening.',
              length: 'Please provide between 3 and 100 characters.'
            }"
            :classes="{
              outer: 'mb-6',
              fieldset: 'border border-p4a-body-text rounded-lg p-4',
              legend: 'px-2 font-semibold text-p4a-subtle',
              inner: 'mt-1',
              input: 'py-2'
            }"
          />

          <FormKit
            type="select"
            name="category"
            label="Which area does this relate to?"
            :options="categoryOptions"
            placeholder="Select an area..."
            validation="required"
            :classes="{
              outer: 'mb-6',
              fieldset: 'border border-p4a-body-text rounded-lg p-4',
              legend: 'px-2 font-semibold text-p4a-subtle',
              inner: 'mt-1',
              input: 'py-2'
            }"
          />

          <FormKit
            type="text"
            name="affected_parties_text"
            label="What category of society is most affected?"
            help="Optional"
            placeholder="Describe citizens most impacted"
            validation="length:0,150"
            :validation-messages="{
              length: 'Please limit to 150 characters or less.'
            }"
            :classes="{
              outer: 'mb-6',
              fieldset: 'border border-p4a-body-text rounded-lg p-4',
              legend: 'px-2 font-semibold text-p4a-subtle',
              inner: 'mt-1',
              input: 'py-2'
            }"
          />
        </FormKit>

        <!-- Step 2: Context -->
        <FormKit type="step" name="context" label="Context">
          <FormKit
            type="text"
            name="responsible_party"
            label="What organization, institution, or system is involved?"
            placeholder="The responsible party"
            help="Optional"
            :classes="{
              outer: 'mb-6',
              fieldset: 'border border-p4a-body-text rounded-lg p-4',
              legend: 'px-2 font-semibold text-p4a-subtle',
              inner: 'mt-1',
              input: 'py-2'
            }"
          />

          <FormKit
            type="radio"
            name="occurred_time_text"
            label="When did this happen?"
            :options="[
              'Ongoing',
              'Recently',
              'Within the past year',
              'More than a year ago',
              'Not sure'
            ]"
            validation="required"
            :classes="{
              outer: 'mb-6',
              fieldset: 'border border-p4a-body-text rounded-lg p-4',
              legend: 'px-2 font-semibold text-p4a-subtle',
              wrapper: 'space-y-2 flex flex-col',
              options: 'space-y-2',
              option: 'flex items-center',
              inner: '$reset inline',
              input: '$reset w-5 h-5 mr-3',
              label: 'inline'
            }"
          />

        </FormKit>

        <!-- Step 3: Details -->
        <FormKit type="step" name="details" label="Details">
          <FormKit
            type="textarea"
            name="observations_text"
            label="What have you observed?"
            help="Optional"
            validation="length:0,1000"
            :validation-messages="{
              length: 'Please limit to 1000 characters or less.'
            }"
            rows="3"
            :classes="{
              outer: 'mb-6',
              fieldset: 'border border-p4a-body-text rounded-lg p-4',
              legend: 'px-2 font-semibold text-p4a-subtle',
              inner: 'mt-1',
              input: 'py-2'
            }"
          />

          <FormKit
            type="textarea"
            name="why_it_matters_text"
            label="Why does this matter to you?"
            help="Optional"
            validation="length:0,750"
            :validation-messages="{
              length: 'Please limit to 750 characters or less.'
            }"
            rows="3"
            :classes="{
              outer: 'mb-6',
              fieldset: 'border border-p4a-body-text rounded-lg p-4',
              legend: 'px-2 font-semibold text-p4a-subtle',
              inner: 'mt-1',
              input: 'py-2'
            }"
          />

          <FormKit
            type="textarea"
            name="supporting_links"
            label="Supporting links"
            help="Optional - one URL per line"
            validation="length:0,500"
            :validation-messages="{
              length: 'Please limit to 500 characters or less.'
            }"
            placeholder="https://example.com&#10;https://another-source.com"
            rows="3"
            :classes="{
              outer: 'mb-6',
              fieldset: 'border border-p4a-body-text rounded-lg p-4',
              legend: 'px-2 font-semibold text-p4a-subtle',
              inner: 'mt-1',
              input: 'py-2'
            }"
          />

          <FormKit
            type="textarea"
            name="other_notes"
            label="Anything else to add?"
            help="Optional"
            validation="length:0,1000"
            :validation-messages="{
              length: 'Please limit to 1000 characters or less.'
            }"
            rows="3"
            :classes="{
              outer: 'mb-6',
              fieldset: 'border border-p4a-body-text rounded-lg p-4',
              legend: 'px-2 font-semibold text-p4a-subtle',
              inner: 'mt-1',
              input: 'py-2'
            }"
          />
        </FormKit>

        <!-- Step 4: Privacy & review -->
        <FormKit type="step" name="privacy_and_review" label="Privacy & review">
          <fieldset class="mb-6 p-4 border border-p4a-body-text rounded-lg">
            <legend class="px-2 font-semibold text-p4a-subtle">Acknowledgements</legend>
            <div class="space-y-2 mt-2">
              <FormKit
                type="checkbox"
                name="is_emergency_confirm"
                :options="['This is not an emergency or crime in progress']"
                validation="required"
                :validation-messages="{
                  required: 'Please confirm this is not an emergency.'
                }"
                :classes="{
                  outer: 'mb-0',
                  fieldset: 'border-0 p-0 m-0',
                  wrapper: 'space-y-2 flex flex-col',
                  options: 'space-y-2',
                  option: 'flex items-center',
                  inner: '$reset inline',
                  input: '$reset w-5 h-5 mr-3',
                  label: 'inline'
                }"
              />

              <FormKit
                type="checkbox"
                name="good_faith_confirm"
                :options="['I am submitting this in good faith']"
                validation="required"
                :validation-messages="{
                  required: 'Please confirm you are submitting in good faith.'
                }"
                :classes="{
                  outer: 'mb-0',
                  fieldset: 'border-0 p-0 m-0',
                  wrapper: 'space-y-2 flex flex-col',
                  options: 'space-y-2',
                  option: 'flex items-center',
                  inner: '$reset inline',
                  input: '$reset w-5 h-5 mr-3',
                  label: 'inline'
                }"
              />

              <FormKit
                type="checkbox"
                name="privacy_ack"
                :options="['I understand this report may be reviewed, summarized, and categorized']"
                validation="required"
                :validation-messages="{
                  required: 'Please acknowledge the privacy terms.'
                }"
                :classes="{
                  outer: 'mb-0',
                  fieldset: 'border-0 p-0 m-0',
                  wrapper: 'space-y-2 flex flex-col',
                  options: 'space-y-2',
                  option: 'flex items-center',
                  inner: '$reset inline',
                  input: '$reset w-5 h-5 mr-3',
                  label: 'inline'
                }"
              />
            </div>
          </fieldset>

          <fieldset class="mb-6 p-4 border border-p4a-body-text rounded-lg">
            <legend class="px-2 font-semibold text-p4a-subtle">Would you like to stay reachable?</legend>
            <div class="space-y-2 mt-2">
              <label v-for="option in ['Submit anonymously with no follow-up', 'Provide email for follow-up']" :key="option" class="flex items-center">
                <input
                  type="radio"
                  name="followup_mode"
                  :value="option"
                  v-model="followupMode"
                  class="w-5 h-5 mr-3"
                  required
                  />
                  <span class="text-p4a-subtle">{{ option }}</span>
                </label>
              </div>
              <p class="text-sm mt-2d text-center text-p4a-body-text">We will use your email to create a free account for you.</p>
          </fieldset>

          <!-- Hidden field to capture followupMode in FormKit structure -->
          <FormKit type="hidden" name="followup_mode" v-model="followupMode" />

          <FormKit
            v-if="showFollowupEmail"
            type="email"
            name="followup_email"
            label="Email for follow-up"
            validation="email"
            :validation-messages="{
              email: 'Please enter a valid email address.'
            }"
            :classes="{
              outer: 'mb-6',
              fieldset: 'border border-p4a-body-text rounded-lg p-4',
              legend: 'px-2 font-semibold text-p4a-subtle',
              inner: 'mt-1',
              input: 'py-2'
            }"
          />

          <FormKit
            v-if="showFollowupEmail"
            type="checkbox"
            name="consent_contact"
            :options="['P4A may contact me about this report']"
            :classes="{
              outer: 'mb-6',
              fieldset: 'border border-p4a-body-text rounded-lg p-4',
              legend: 'px-2 font-semibold text-p4a-subtle',
              wrapper: 'space-y-2 flex flex-col',
              options: 'space-y-2',
              option: 'flex items-center',
              inner: '$reset inline',
              input: '$reset w-5 h-5 mr-3',
              label: 'inline'
            }"
          />

          <div class="w-full px-2 pt-2 pb-1 mb-6 bg-p4a-accent">
            <p class="mb-2 text-sm text-p4a-bg">
              You do not need legal language or a polished writeup. Just start with what you’ve seen.
              Please submit only sincere, good-faith reports. Anonymous submissions are welcome, but not all reports will advance.
              Please review your responses before submitting.
            </p>
          </div>
          <template #stepNext>
            <FormKit
              type="submit"
              label="Submit Report"
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
:deep(select),
:deep(textarea),
:deep(label),
:deep(button),
:deep(h3),
:deep(p) {
  font-family: "Jost", system-ui, -apple-system, sans-serif !important;
}

/* Fix select dropdown text color */
:deep(select) {
  color: #111827 !important;
}

:deep(select option) {
  color: #111827 !important;
}

/* Fix radio button styling */
:deep(input[type="radio"]) {
  width: 1.25rem !important;
  height: 1.25rem !important;
  margin-right: 0.75rem !important;
  padding: 0 !important;
  background: transparent !important;
}

:deep(.formkit-option) {
  background: transparent !important;
  padding: 0 !important;
  margin-bottom: 0.05rem !important;
}

:deep(.formkit-wrapper) {
  background: transparent !important;
}

/* Hide FormKit's custom radio decorator to avoid duplicate circles */
:deep(.formkit-decorator) {
  display: none !important;
}

/* ONLY target radio inner wrapper - not all inputs */
:deep([type="radio"] ~ .formkit-inner) {
  display: inline !important;
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
}

/* Make the wrapper inside radio option flex horizontally and vertically centered */
:deep(.formkit-option .formkit-wrapper) {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  gap: 0.75rem !important;
}

/* Ensure radio label itself is also vertically centered */
:deep(.formkit-option label) {
  display: flex !important;
  align-items: center !important;
  gap: 0.75rem !important;
}

/* Ensure radio input aligns properly with text */
:deep(input[type="radio"]) {
  flex-shrink: 0 !important;
  align-self: flex-start !important;
  margin-top: 0.65rem !important;
}

/* Add spacing between form fields */
:deep(.formkit-outer) {
  margin-bottom: 2rem !important;
}

/* Remove borders from nested checkboxes inside Acknowledgements fieldset */
:deep(fieldset > div > .formkit-outer > .formkit-fieldset) {
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
  background: transparent !important;
}
</style>
