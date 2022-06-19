export const cleanSessionName = (sessionName: string): string => sessionName.trim().replace(/(^\/*)|(\/*$)/g, '')
