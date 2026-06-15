import type { Ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import type { FormInstance } from '@arco-design/web-vue'

export interface UseFormHandlerOptions<T extends Record<string, any>> {
  formRef: Ref<FormInstance | undefined>
  formData: T
  successMessage: string
  extraValidate?: () => boolean | Promise<boolean>
}

export interface UseFormHandlerReturn {
  validateForm: () => Promise<boolean>
  resetForm: () => void
  submit: (onSubmit: () => void | Promise<void>) => Promise<void>
}

export function useFormHandler<T extends Record<string, any>>(
  options: UseFormHandlerOptions<T>,
): UseFormHandlerReturn {
  const { formRef, formData, successMessage, extraValidate } = options

  async function validateForm(): Promise<boolean> {
    try {
      await formRef.value?.validate()
    } catch {
      return false
    }

    if (extraValidate) {
      const extraValid = await extraValidate()
      if (!extraValid) {
        return false
      }
    }

    return true
  }

  function resetForm(): void {
    ;(Object.keys(formData) as Array<keyof T>).forEach((key) => {
      ;(formData as any)[key] = ''
    })
    formRef.value?.clearValidate()
  }

  async function submit(onSubmit: () => void | Promise<void>): Promise<void> {
    const valid = await validateForm()
    if (!valid) return

    await onSubmit()

    Message.success(successMessage)
    resetForm()
  }

  return {
    validateForm,
    resetForm,
    submit,
  }
}
