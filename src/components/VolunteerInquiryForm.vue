<script setup lang="ts">
import { ref, computed } from 'vue'
import { createMultiStepPlugin } from '@formkit/addons'

const primarySkill = ref('')
const secondarySkill = ref('')
const selectedStrengths = ref<string[]>([])
const availability = ref('')
const isSubmitted = ref(false)

const skills = [
  'Research & Analysis',
  'Strategy & Systems Thinking',
  'Writing & Messaging',
  'Community & Stakeholder Engagement',
  'Facilitation & Alignment',
  'Execution & Project Management',
  'Technical Build (Engineering / Data / Product)',
  'Review & Critical Feedback'
]

const strengths = [
  'Adaptability',
  'Analytical',
  'Communication',
  'Courage',
  'Creativity',
  'Curiosity',
  'Empathy',
  'Fairness',
  'Integrity',
  'Judgment',
  'Leadership',
  'Organization',
  'Perseverance',
  'Relationship-Building',
  'Strategic Perspective',
  'Teamwork'
]

const availabilityOptions = [
  { label: '1–2 hours', value: '1–2 hours' },
  { label: '3–5 hours', value: '3–5 hours' },
  { label: '5–10 hours', value: '5–10 hours' },
  { label: '10+ hours', value: '10+ hours' },
  { label: 'It varies', value: 'It varies' }
]

const showRemoveLink = computed(() => secondarySkill.value !== '')

const removeSecondary = () => {
  secondarySkill.value = ''
}

const toggleStrength = (strength: string) => {
  const index = selectedStrengths.value.indexOf(strength)
  if (index > -1) {
    selectedStrengths.value.splice(index, 1)
  } else if (selectedStrengths.value.length < 5) {
    selectedStrengths.value.push(strength)
  }
}

const strengthsCount = computed(() => `${selectedStrengths.value.length}/5`)
const strengthsString = computed(() => selectedStrengths.value.join(', '))

const submitForm = async (formData: any) => {
  console.log('=== FORM SUBMISSION START ===')
  console.log('Raw FormKit data:', formData)
  console.log('Primary skill:', primarySkill.value)
  console.log('Secondary skill:', secondarySkill.value)
  console.log('Selected strengths:', selectedStrengths.value)

  try {
    // Extract data from nested FormKit structure
    const stepData = Object.values(formData)[0] as any

    // Build Airtable payload
    const airtablePayload = {
      fields: {
        'Bio': stepData.about_you?.introduction || stepData.about_you?.bio || '',
        'Weekly hours': availability.value, // Single select - string
        'Skill 1': primarySkill.value,
        'Skill 2': secondarySkill.value,
        'Strengths': selectedStrengths.value, // Multi-select - array
        'Name': stepData.finish?.name || '',
        'Email': stepData.finish?.email || ''
      }
    }

    console.log('Airtable payload:', airtablePayload)
    console.log('Payload as JSON:', JSON.stringify(airtablePayload, null, 2))

    // Get Airtable credentials from environment variables
    const baseId = import.meta.env.PUBLIC_AIRTABLE_VOLUNTEER_INQUIRY_BASE_ID
    const tableName = import.meta.env.PUBLIC_AIRTABLE_VOLUNTEER_INQUIRY_TABLE_NAME
    const apiKey = import.meta.env.PUBLIC_AIRTABLE_API_ACCESS_KEY_Q226

    // Build Airtable API endpoint
    const airtableUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`

    console.log('Posting to:', airtableUrl)

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
    console.log('=== FORM SUBMISSION END ===')

    isSubmitted.value = true

  } catch (error) {
    console.error('Network error:', error)
    console.log('=== FORM SUBMISSION END ===')
    alert('There was an error submitting your form. Please check your connection and try again.')
  }
}
</script>

<template>
  <div>
    <div v-if="isSubmitted" class="text-center py-12">
      <h2 class="text-3xl font-bold text-p4a-bg1 mb-4">Thank you!</h2>
      <p class="text-lg text-p4a-bg0">We've received your inquiry and will be in touch soon.</p>
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
        <p class="text-sm mb-6 text-center text-gray-600">All entries are required</p>

        <FormKit type="step" name="about_you" label="About you">
          <!-- Introduction -->
          <FormKit
            type="textarea"
            name="introduction"
            label="Tell us about yourself"
            validation="required"
            rows="4"
            :classes="{
              outer: 'mb-8',
              fieldset: 'border border-p4a-bg2 rounded-lg p-4',
              legend: 'px-2 font-semibold text-gray-900',
              inner: 'mt-1',
              input: 'py-2'
            }"
          />

          <!-- Weekly Availability -->
          <fieldset class="mb-8 p-4 border border-p4a-bg2 rounded-lg">
            <legend class="px-2 font-semibold text-gray-900">Weekly availability</legend>
            <p class="text-sm mb-4">How much time can you realistically contribute per week?</p>

            <div class="space-y-2">
              <label v-for="option in availabilityOptions" :key="option.value" class="flex items-center">
                <input
                  type="radio"
                  name="availability"
                  v-model="availability"
                  :value="option.value"
                  class="w-5 h-5 mr-3 text-blue-600"
                  required
                />
                <span class="text-gray-900">{{ option.label }}</span>
              </label>
            </div>
          </fieldset>

          <!-- Hidden field to capture availability in FormKit structure -->
          <FormKit type="hidden" name="availability" v-model="availability" />
        </FormKit>

        <FormKit type="step" name="skills" label="Skills">
          <!-- Hidden fields to capture custom data in FormKit structure -->
          <FormKit type="hidden" name="primarySkill" v-model="primarySkill" />
          <FormKit type="hidden" name="secondarySkill" v-model="secondarySkill" />
          <FormKit type="hidden" name="strengths" v-model="strengthsString" />

          <!-- Contribution -->
          <fieldset class="mb-12 p-4 border border-p4a-bg2 rounded-lg">
            <legend class="px-2 font-semibold text-xl">Tell us what you like to do</legend>
            <p class="text-sm mb-1">Choose your 1st favorite skill and optionally choose your 2nd favorite skill</p>
            <p class="text-sm italic text-gray-500 mb-4">Most people are flexible in at least one other area.</p>

            <div class="space-y-3">
              <div class="grid grid-cols-[1fr_100px_100px] gap-4 items-center font-semibold mb-2">
                <div></div>
                <div class="text-center">First</div>
                <div class="text-center">Second</div>
              </div>

              <div v-for="skill in skills" :key="skill" class="grid grid-cols-[1fr_100px_100px] gap-4 items-center">
                <div>{{ skill }}</div>
                <div class="flex justify-center">
                  <input
                    type="radio"
                    :value="skill"
                    v-model="primarySkill"
                    class="w-5 h-5"
                    required
                  />
                </div>
                <div class="flex justify-center">
                  <input
                    type="radio"
                    :value="skill"
                    v-model="secondarySkill"
                    :disabled="primarySkill === skill"
                    class="w-5 h-5"
                  />
                </div>
              </div>
            </div>

            <div v-if="showRemoveLink" class="mt-3 grid grid-cols-[1fr_100px_100px] gap-4">
              <div></div>
              <div></div>
              <div class="flex justify-center">
                <button
                  type="button"
                  @click="removeSecondary"
                  class="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </fieldset>

          <!-- Strengths -->
          <fieldset class="mb-8 p-4 border border-p4a-bg2 rounded-lg">
            <legend class="px-2 font-semibold text-xl">Tell us your strengths</legend>
            <p class="text-sm mb-4">Select up to 5 strengths that describe how you naturally show up</p>

            <div class="flex flex-wrap gap-2 mb-3">
              <button
                v-for="strength in strengths"
                :key="strength"
                type="button"
                @click="toggleStrength(strength)"
                :class="[
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  selectedStrengths.includes(strength)
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-900 hover:bg-blue-200'
                ]"
                :disabled="!selectedStrengths.includes(strength) && selectedStrengths.length >= 5"
              >
                {{ strength }}
              </button>
            </div>

            <p class="text-sm">Selected: {{ strengthsCount }}</p>
          </fieldset>
        </FormKit>

        <FormKit type="step" name="finish" label="Finish">
          <!-- Name -->
          <FormKit
            type="text"
            name="name"
            label="Full Name"
            validation="required"
            :classes="{
              outer: 'mb-8',
              fieldset: 'border border-p4a-bg2 rounded-lg p-4',
              legend: 'px-2 font-semibold text-gray-900',
              inner: 'mt-1',
              input: 'py-2'
            }"
          />

          <!-- Email -->
          <FormKit
            type="email"
            name="email"
            label="Email Address"
            validation="required|email"
            :classes="{
              outer: 'mb-8',
              fieldset: 'border border-p4a-bg2 rounded-lg p-4',
              legend: 'px-2 font-semibold text-gray-900',
              inner: 'mt-1',
              input: 'py-2'
            }"
          />

          <template #stepNext>
            <FormKit
              type="submit"
              label="Submit Inquiry"
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
