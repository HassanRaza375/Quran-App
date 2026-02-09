import { ref } from 'vue'

const show = ref(false)
const message = ref('')
const color = ref<'success' | 'error' | 'info' | 'warning'>('info')
const timeout = ref(3000)

export const useToast = () => {
    const toast = (
        text: string,
        options?: {
            color?: typeof color.value
            timeout?: number
        }
    ) => {
        message.value = text
        color.value = options?.color ?? 'info'
        timeout.value = options?.timeout ?? 3000
        show.value = true
    }

    return {
        show,
        message,
        color,
        timeout,
        toast,
    }
}
