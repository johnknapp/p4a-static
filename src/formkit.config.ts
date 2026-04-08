import { defaultConfig } from '@formkit/vue'
import { generateClasses } from '@formkit/themes'

export default defaultConfig({
  config: {
    classes: generateClasses({
      global: {
        outer: 'mb-6',
        label: 'block mb-2 font-semibold text-p4a-subtle',
        inner: 'border border-p4a-body-text rounded-lg overflow-hidden focus-within:border-p4a-ink bg-white',
        input: 'w-full px-4 py-2 border-none focus:outline-none bg-white',
        help: 'text-sm text-p4a-faint mt-1',
        messages: 'list-none p-0 mt-1',
        message: 'text-p4a-danger text-sm',
      },
      textarea: {
        inner: 'border border-p4a-body-text rounded-lg overflow-hidden focus-within:border-p4a-ink bg-white',
        input: 'w-full px-4 py-2 border-none focus:outline-none bg-white',
      },
      radio: {
        outer: 'mb-3',
        fieldset: 'border-0 p-0 m-0',
        wrapper: 'flex flex-col space-y-2',
        legend: 'block mb-3 font-semibold text-p4a-subtle',
        options: 'flex flex-col space-y-2',
        option: 'flex items-center',
        input: 'mr-2 w-5 h-5 text-p4a-link',
        label: 'text-p4a-subtle',
      },
      checkbox: {
        outer: 'mb-3',
        fieldset: 'border-0 p-0 m-0',
        wrapper: 'flex flex-col space-y-2',
        legend: 'block mb-3 font-semibold text-p4a-subtle',
        options: 'flex flex-col space-y-2',
        option: 'flex items-center',
        input: 'mr-3 w-5 h-5 text-p4a-link',
        label: 'text-p4a-subtle',
      },
      submit: {
        input: 'bg-p4a-ink hover:bg-p4a-body-text text-white font-semibold px-8 py-3 rounded-lg cursor-pointer transition-colors w-full',
      },
    }),
  },
})
