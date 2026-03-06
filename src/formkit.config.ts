import { defaultConfig } from '@formkit/vue'
import { generateClasses } from '@formkit/themes'

export default defaultConfig({
  config: {
    classes: generateClasses({
      global: {
        outer: 'mb-6',
        label: 'block mb-2 font-semibold text-gray-900',
        inner: 'border border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-500 bg-white',
        input: 'w-full px-4 py-2 border-none focus:outline-none bg-white',
        help: 'text-sm text-gray-600 mt-1',
        messages: 'list-none p-0 mt-1',
        message: 'text-red-600 text-sm',
      },
      textarea: {
        inner: 'border border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-500 bg-white',
        input: 'w-full px-4 py-2 border-none focus:outline-none bg-white',
      },
      radio: {
        outer: 'mb-3',
        fieldset: 'border-0 p-0 m-0',
        wrapper: 'flex flex-col space-y-2',
        legend: 'block mb-3 font-semibold text-gray-900',
        options: 'flex flex-col space-y-2',
        option: 'flex items-center',
        input: 'mr-2 w-5 h-5 text-blue-600',
        label: 'text-gray-900',
      },
      submit: {
        input: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg cursor-pointer transition-colors w-full',
      },
    }),
  },
})
