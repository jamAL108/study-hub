import { youtubeExtractstring , shrinkText , formatViews , validateEmail , extractEmailPrefix , formatDate , isYouTubeURL , pairUserAssistant, areObjectsEqual } from './string'
// import { errorLogger , successLogger } from './toast'
import  ModelConfig from './model'

/// exports 

export const YoutubeExtractVideoID = youtubeExtractstring;
export const ShrinkTitle = shrinkText
export const FormatVideoViews = formatViews
export const validateEmailInput = validateEmail
export const extractEmailInputPrefix = extractEmailPrefix
export const isStringYouTubeURL = isYouTubeURL
export const formatDateFunction = formatDate
export const pairUserAssistantFunction = pairUserAssistant
export const areObjectsEqualFunction = areObjectsEqual

// export const errorLoggerUtil = errorLogger
// export const successLoggerUtil = successLogger

export const geminiModel = ModelConfig