<script setup lang="ts">
import { ref } from 'vue'
import { createMultiStepPlugin } from '@formkit/addons'

const isSubmitted = ref(false)
const roleOther = ref(false)
const concernOther = ref(false)
const role = ref('')
const mainConcerns = ref('')
const worthPursuing = ref('')
const engagementLevel = ref<number | null>(null)
const currentEffectiveness = ref<number | null>(null)
const compellingScore = ref<number | null>(null)
const likelihoodToEngage = ref<number | null>(null)

const roleOptions = [
  'Interested citizen',
  'Private sector',
  'Government official or public servant',
  'Nonprofit or civic organization',
  'Policy / research / advocacy',
  'Student / academic',
  'Other'
]

const engagementOptions = [
  { label: 'Submit ideas', value: 'Submit ideas' },
  { label: 'Comment or discuss', value: 'Comment or discuss' },
  { label: 'Vote or rank ideas', value: 'Vote or rank ideas' },
  { label: 'Read and learn', value: 'Read and learn' },
  { label: 'Share ideas with others', value: 'Share ideas with others' },
  { label: 'I likely wouldn’t engage directly', value: 'I likely wouldn’t engage directly' }
]

const concernOptions = [
  'Signal-to-noise ratio',
  'Polarization or bad-faith participation',
  'Duplication of existing efforts',
  'Difficulty attracting government participation',
  'Lack of real-world impact',
  'Moderation challenges',
  'No major concerns',
  'Other'
]

const worthPursuingOptions = [
  'Yes',
  'Maybe',
  'No'
]

const submitForm = async (formData: any) => {
  console.log('=== FORM SUBMISSION START ===')
  console.log('Raw FormKit data:', formData)

  try {
    // Extract data from nested FormKit structure
    const stepData = Object.values(formData)[0] as any

    // Build Airtable payload
    const role = stepData.about_you?.role === 'Other'
      ? stepData.about_you?.roleOtherText
      : stepData.about_you?.role || ''

    const concern = stepData.engagement?.mainConcerns === 'Other'
      ? stepData.engagement?.concernOtherText
      : stepData.engagement?.mainConcerns || ''

    const airtablePayload = {
      fields: {
        'about_you': role,
        'how_engaged': stepData.your_perspective?.engagementLevel || 0,
        'how_effective': stepData.your_perspective?.currentEffectiveness || 0,
        'how_compelling_or_not': stepData.your_perspective?.compellingScore || 0,
        'why_compelling_or_not': stepData.your_perspective?.whatMakesCompelling || '',
        'likelyhood_to_engage': stepData.engagement?.likelihoodToEngage || 0,
        'engagement_type': stepData.engagement?.howEngage || [],
        'primary_concern': concern,
        'worth_persuing': stepData.final_thoughts?.worthPursuing || '',
        'your_reaction': stepData.final_thoughts?.whyOrWhyNot || '',
        'email': stepData.final_thoughts?.email || ''
      }
    }

    console.log('Airtable payload:', airtablePayload)
    console.log('Payload as JSON:', JSON.stringify(airtablePayload, null, 2))

    // Debug: Log character codes for engagement_type values
    if (Array.isArray(airtablePayload.fields.engagement_type)) {
      airtablePayload.fields.engagement_type.forEach((option, idx) => {
        console.log(`engagement_type[${idx}]:`, option)
        console.log(`  Character codes:`, Array.from(option).map(c => `${c}(${c.charCodeAt(0)})`).join(' '))
      })
    }

    // Get Airtable credentials from environment variables
    const baseId = import.meta.env.PUBLIC_AIRTABLE_FEASIBILITY_SURVEY_BASE_ID
    const tableName = import.meta.env.PUBLIC_AIRTABLE_FEASIBILITY_SURVEY_TABLE_NAME
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
      <h2 class="text-3xl font-bold text-p4a-ink mb-4">Thank you!</h2>
      <p class="text-lg">We appreciate you taking the time to share your perspective.</p>
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
        :allow-incomplete="false"
        tab-style="progress"
      >
        <p class="text-sm mb-6 text-center text-p4a-faint">All entries are required unless marked optional</p>

        <!-- Step 1: About you -->
        <FormKit type="step" name="about_you" label="About you">
          <fieldset class="mb-8 p-4 border border-p4a-body-text rounded-lg">
            <legend class="px-2 font-semibold text-p4a-subtle">Which best describes you?</legend>
            <div class="space-y-2">
              <label v-for="option in roleOptions" :key="option" class="flex items-center">
                <input
                  type="radio"
                  name="role"
                  :value="option"
                  v-model="role"                  
                  @change="roleOther = (option === 'Other')"
                  class="w-5 h-5 mr-3 text-p4a-link"
                  required
                />
                <span class="text-p4a-subtle">{{ option }}</span>
              </label>
            </div>

            <FormKit
              v-if="roleOther"
              type="text"
              name="roleOtherText"
              placeholder="Please specify"
              validation="required"
              :classes="{
                outer: 'mt-3',
                inner: 'mt-1',
                input: 'py-2'
              }"
            />
          </fieldset>

          <!-- Hidden field to capture role in FormKit structure -->
          <FormKit type="hidden" name="role" v-model="role" validation="required" />
        </FormKit>

        <!-- Step 2: Your perspective -->
        <FormKit type="step" name="your_perspective" label="Your perspective">
          <!-- Engagement Level -->
          <fieldset class="mb-8 p-4 border border-p4a-body-text rounded-lg">
            <legend class="px-2 font-semibold text-p4a-subtle">
              How engaged are you with public policy or civic issues today?
            </legend>
            <div class="flex items-center justify-center gap-3">
              <span class="text-sm text-p4a-faint whitespace-nowrap">Not very engaged</span>
              <div class="flex gap-3">
                <label v-for="n in 5" :key="n" class="flex items-center">
                  <input
                    type="radio"
                    name="engagementLevel"
                    v-model="engagementLevel"
                    :value="n"
                    class="w-5 h-5"
                    required
                  />
                </label>
              </div>
              <span class="text-sm text-p4a-faint whitespace-nowrap">Very engaged</span>
            </div>
          </fieldset>

          <!-- Hidden field to capture engagementLevel in FormKit structure -->
          <FormKit type="hidden" name="engagementLevel" v-model="engagementLevel" validation="required" />

          <!-- Current Effectiveness -->
          <fieldset class="mb-8 p-4 border border-p4a-body-text rounded-lg">
            <legend class="px-2 font-semibold text-p4a-subtle">
              How effective are current systems at surfacing good ideas for improving government and public policy?
            </legend>
            <div class="flex items-center justify-center gap-3">
              <span class="text-sm text-p4a-faint whitespace-nowrap">Very ineffective</span>
              <div class="flex gap-3">
                <label v-for="n in 5" :key="n" class="flex items-center">
                  <input
                    type="radio"
                    name="currentEffectiveness"
                    v-model="currentEffectiveness"
                    :value="n"
                    class="w-5 h-5"
                    required
                  />
                </label>
              </div>
              <span class="text-sm text-p4a-faint whitespace-nowrap">Very effective</span>
            </div>
          </fieldset>

          <!-- Hidden field to capture currentEffectiveness in FormKit structure -->
          <FormKit type="hidden" name="currentEffectiveness" v-model="currentEffectiveness" validation="required" />

          <!-- Compelling Score -->
          <fieldset class="mb-8 p-4 border border-p4a-body-text rounded-lg">
            <legend class="px-2 font-semibold text-p4a-subtle">
              How compelling do you find the idea of Playbook for America?
            </legend>
            <div class="flex items-center justify-center gap-3">
              <span class="text-sm text-p4a-faint whitespace-nowrap">Not compelling</span>
              <div class="flex gap-3">
                <label v-for="n in 5" :key="n" class="flex items-center">
                  <input
                    type="radio"
                    name="compellingScore"
                    v-model="compellingScore"
                    :value="n"
                    class="w-5 h-5"
                    required
                  />
                </label>
              </div>
              <span class="text-sm text-p4a-faint whitespace-nowrap">Very compelling</span>
            </div>
          </fieldset>

          <!-- Hidden field to capture compellingScore in FormKit structure -->
          <FormKit type="hidden" name="compellingScore" v-model="compellingScore" validation="required" />

          <!-- What Makes Compelling -->
          <FormKit
            type="text"
            name="whatMakesCompelling"
            label="What makes this idea compelling — or not?"
            help="Optional"
            :classes="{
              outer: 'mb-8',
              fieldset: 'border border-p4a-body-text rounded-lg p-4',
              legend: 'px-2 font-semibold text-p4a-subtle',
              wrapper: '',
              inner: 'mt-1',
              input: 'py-2'
            }"
          />
        </FormKit>

        <!-- Step 3: Engagement -->
        <FormKit type="step" name="engagement" label="Engagement">
          <!-- Likelihood to Engage -->
          <fieldset class="mb-8 p-4 border border-p4a-body-text rounded-lg">
            <legend class="px-2 font-semibold text-p4a-subtle">
              How likely would you be to engage with a platform like this?
            </legend>
            <div class="flex items-center justify-center gap-3">
              <span class="text-sm text-p4a-faint whitespace-nowrap">Very unlikely</span>
              <div class="flex gap-3">
                <label v-for="n in 5" :key="n" class="flex items-center">
                  <input
                    type="radio"
                    name="likelihoodToEngage"
                    v-model="likelihoodToEngage"
                    :value="n"
                    class="w-5 h-5"
                    required
                  />
                </label>
              </div>
              <span class="text-sm text-p4a-faint whitespace-nowrap">Very likely</span>
            </div>
          </fieldset>

          <!-- Hidden field to capture likelihoodToEngage in FormKit structure -->
          <FormKit type="hidden" name="likelihoodToEngage" v-model="likelihoodToEngage" validation="required" />

          <!-- How Would Engage -->
          <FormKit
            type="checkbox"
            name="howEngage"
            label="How would you most likely engage?"
            :options="engagementOptions"
            validation="required"
            :classes="{
              outer: 'mb-8',
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

          <!-- Main Concerns -->
          <fieldset class="mb-8 p-4 border border-p4a-body-text rounded-lg">
            <legend class="px-2 font-semibold text-p4a-subtle">What concerns you most about a platform like this?</legend>
            <div class="space-y-2">
              <label v-for="option in concernOptions" :key="option" class="flex items-center">
                <input
                  type="radio"
                  name="mainConcerns"
                  :value="option"
                  v-model="mainConcerns"
                  @change="concernOther = (option === 'Other')"
                  class="w-5 h-5 mr-3 text-p4a-link"
                  required
                />
                <span class="text-p4a-subtle">{{ option }}</span>
              </label>
            </div>

            <FormKit
              v-if="concernOther"
              type="text"
              name="concernOtherText"
              placeholder="Please specify"
              validation="required"
              :classes="{
                outer: 'mt-3',
                inner: 'mt-1',
                input: 'py-2'
              }"
            />
          </fieldset>

          <!-- Hidden field to capture mainConcerns in FormKit structure -->
          <FormKit type="hidden" name="mainConcerns" v-model="mainConcerns" validation="required" />
        </FormKit>

        <!-- Step 4: Final thoughts -->
        <FormKit type="step" name="final_thoughts" label="Final thoughts">
          <fieldset class="mb-8 p-4 border border-p4a-body-text rounded-lg">
            <legend class="px-2 font-semibold text-p4a-subtle">Do you think a platform like Playbook for America is worth pursuing?</legend>
            <div class="space-y-2">
              <label v-for="option in worthPursuingOptions" :key="option" class="flex items-center">
                <input
                  type="radio"
                  name="worthPursuing"
                  :value="option"
                  v-model="worthPursuing"
                  class="w-5 h-5 mr-3 text-p4a-link"
                  required
                />
                <span class="text-p4a-subtle">{{ option }}</span>
              </label>
            </div>
          </fieldset>

          <!-- Hidden field to capture worthPursuing in FormKit structure -->
          <FormKit type="hidden" name="worthPursuing" v-model="worthPursuing" validation="required" />

          <FormKit
            type="textarea"
            name="whyOrWhyNot"
            label="Why or why not do you think we should pursue this?"
            help="Optional"
            rows="4"
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
            label="Provide your email to stay informed"
            help="Optional"
            validation="email"
            :classes="{
              outer: 'mb-8',
              fieldset: 'border border-p4a-body-text rounded-lg p-4',
              legend: 'px-2 font-semibold text-p4a-subtle',
              inner: 'mt-1',
              input: 'py-2'
            }"
          />

          <template #stepNext>
            <FormKit
              type="submit"
              label="Submit Survey"
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

/* Fix checkbox styling - remove gray background between checkbox and label */
:deep(input[type="checkbox"]) {
  width: 1.25rem !important;
  height: 1.25rem !important;
  margin-right: 0.75rem !important;
  padding: 0 !important;
  background: transparent !important;
}

:deep(.formkit-option) {
  background: transparent !important;
  padding: 0 !important;
}

:deep(.formkit-wrapper) {
  background: transparent !important;
}

/* Hide FormKit's custom checkbox decorator to avoid duplicate checkmarks */
:deep(.formkit-decorator) {
  display: none !important;
}

/* ONLY target checkbox inner wrapper - not all inputs */
:deep([type="checkbox"] ~ .formkit-inner) {
  display: inline !important;
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
}

/* Make the wrapper inside checkbox option flex horizontally and vertically centered */
:deep(.formkit-option .formkit-wrapper) {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  gap: 0.75rem !important;
}

/* Ensure checkbox label itself is also vertically centered */
:deep(.formkit-option label) {
  display: flex !important;
  align-items: center !important;
  gap: 0.75rem !important;
}

/* Ensure checkbox input aligns properly without affecting line spacing */
:deep(input[type="checkbox"]) {
  flex-shrink: 0 !important;
  align-self: center !important;
  transform: translateY(2px) !important;
}
</style>
