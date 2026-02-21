<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showOtherRole = ref(false)
const isSubmitting = ref(false)
const submitMessage = ref('')
const formLoadTime = ref(0)

onMounted(() => {
  formLoadTime.value = Date.now()
})

const handleRoleChange = (value: string | undefined) => {
  showOtherRole.value = value === 'Other'
}

const submitHandler = async (data: any) => {
  isSubmitting.value = true
  submitMessage.value = ''

  // Anti-spam checks
  // 1. Honeypot check - if bot fills hidden field, reject
  if (data.website) {
    console.log('Spam detected: honeypot filled')
    isSubmitting.value = false
    return
  }

  // 2. Time-based check - submission must be at least 3 seconds after load
  const submissionTime = Date.now() - formLoadTime.value
  if (submissionTime < 3000) {
    console.log('Spam detected: too fast')
    isSubmitting.value = false
    return
  }

  try {
    const apiKey = import.meta.env.PUBLIC_AIRTABLE_API_ACCESS_KEY
    const baseId = import.meta.env.PUBLIC_AIRTABLE_INFORMED_BASE_ID
    const tableName = import.meta.env.PUBLIC_AIRTABLE_INFORMED_TABLE_NAME

    console.log('Env values:', {
      apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'MISSING',
      baseId,
      tableName
    })

    const roleValue = data.role === 'Other' ? data.roleOther || 'Other' : data.role

    const url = `https://api.airtable.com/v0/${baseId}/${tableName}`
    console.log('POST URL:', url)

    const payload = {
      fields: {
        name: data.name,
        email: data.email,
        role: roleValue,
      },
    }
    console.log('Payload:', payload)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    console.log('Response status:', response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Airtable error response:', errorData)
      throw new Error(`Submission failed: ${response.status}`)
    }

    const result = await response.json()
    console.log('Success:', result)
    submitMessage.value = "Thanks! We'll keep you informed."
  } catch (error) {
    console.error('Form submission error:', error)
    submitMessage.value = 'Something went wrong. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <FormKit
    type="form"
    @submit="submitHandler"
    :actions="false"
  >
    <!-- Honeypot field - hidden from users, visible to bots -->
    <FormKit
      type="text"
      name="website"
      label="Website"
      outer-class="!hidden"
      tabindex="-1"
      autocomplete="off"
    />

    <FormKit
      type="text"
      name="name"
      label="Name (optional)"
      placeholder="Your name"
      outer-class="mb-3"
      label-class="block mb-1 font-semibold text-gray-700 text-sm"
      inner-class="border border-p4a-bg2 rounded-md overflow-hidden focus-within:border-p4a-bg1"
      input-class="w-full px-3 py-2 border-none focus:outline-none text-sm bg-white"
    />

    <FormKit
      type="email"
      name="email"
      label="Email (required)"
      placeholder="your@email.com"
      validation="required|email"
      outer-class="mb-3"
      label-class="block mb-1 font-semibold text-gray-700 text-sm"
      inner-class="border border-p4a-bg2 rounded-md overflow-hidden focus-within:border-p4a-bg1"
      input-class="w-full px-3 py-2 border-none focus:outline-none text-sm bg-white"
    />

    <FormKit
      type="select"
      name="role"
      label="Role (optional)"
      placeholder="Select your role"
      @input="handleRoleChange"
      outer-class="mb-3"
      label-class="block mb-1 font-semibold text-gray-700 text-sm"
      inner-class="border border-p4a-bg2 rounded-md overflow-hidden focus-within:border-p4a-bg1"
      input-class="w-full px-3 py-2 border-none focus:outline-none text-sm bg-white"
      :options="[
        'Interested citizen',
        'Student / academic',
        'Government / public sector',
        'Nonprofit / civic organization',
        'Private sector',
        'Research / policy',
        'Other'
      ]"
    />

    <FormKit
      v-if="showOtherRole"
      type="text"
      name="roleOther"
      label="Please specify"
      placeholder="Enter your role"
      outer-class="mb-3"
      label-class="block mb-1 font-semibold text-gray-700 text-sm"
      inner-class="border border-p4a-bg2 rounded-md overflow-hidden focus-within:border-p4a-bg1"
      input-class="w-full px-3 py-2 border-none focus:outline-none text-sm bg-white"
    />

    <button
      type="submit"
      :disabled="isSubmitting"
      class="w-full bg-p4a-bg1 hover:bg-p4a-bg2 disabled:bg-gray-400 text-white font-bold py-3 rounded-md transition-colors"
    >
      {{ isSubmitting ? 'Submitting...' : 'Stay informed' }}
    </button>

    <p v-if="submitMessage" class="mt-3 text-sm text-center" :class="submitMessage.includes('Thanks') ? 'text-green-600' : 'text-red-600'">
      {{ submitMessage }}
    </p>
  </FormKit>
</template>
