import { defaultConfig } from '@formkit/vue'
import { generateClasses } from '@formkit/themes'

export default defaultConfig({
  config: {
    classes: generateClasses({
      global: {
        outer: 'mb-4',
        label: 'block mb-2 font-semibold text-gray-700',
        inner: 'border border-gray-300 rounded-lg overflow-hidden focus-within:border-p4a-bg1',
        input: 'w-full px-4 py-2 border-none focus:outline-none',
        help: 'text-sm text-gray-600 mt-1',
        messages: 'list-none p-0 mt-1',
        message: 'text-red-600 text-sm',
      },
      submit: {
        input: 'bg-p4a-bg1 hover:bg-p4a-bg2 text-white font-bold px-8 py-3 rounded-lg cursor-pointer transition-colors',
      },
    }),
  },
})
