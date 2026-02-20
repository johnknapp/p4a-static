<script setup lang="ts">
import { plugin, defaultConfig } from '@formkit/vue'
import config from '../formkit.config'

const submitHandler = async (data: any) => {
  console.log('Form data:', data)

  // Example POST request
  // const response = await fetch('/api/your-endpoint', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // })

  alert('Form submitted! Check console for data.')
}
</script>

<template>
  <FormKit
    type="form"
    :config="config"
    @submit="submitHandler"
  >
    <FormKit
      type="text"
      name="name"
      label="Name"
      placeholder="Enter your name"
      validation="required"
      help="Please enter your full name"
    />

    <FormKit
      type="email"
      name="email"
      label="Email"
      placeholder="your@email.com"
      validation="required|email"
    />

    <FormKit
      type="textarea"
      name="message"
      label="Message"
      placeholder="Your message..."
      validation="required|length:10"
      help="Minimum 10 characters"
    />

    <FormKit
      type="submit"
      label="Submit"
    />
  </FormKit>
</template>
