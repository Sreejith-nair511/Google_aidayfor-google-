export interface ProcessedEvent {
  id: string
  type: "Traffic" | "Weather" | "Infrastructure" | "Event"
  title: string
  location: string
  urgency: "Low" | "Medium" | "High" | "Critical"
  description: string
  advice: string
  prediction?: string
  affectedAreas: string[]
  estimatedDuration?: string
}
