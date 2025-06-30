"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, MapPin, Clock, Car, Droplets, Users, Power, Plus, Minus, Volume2, VolumeX } from "lucide-react"
import dynamic from "next/dynamic"
import type { ProcessedEvent } from "./types"

const MapComponent = dynamic(() => import("./components/map"), { ssr: false })

interface RawDataItem {
  id: string
  source: "Twitter" | "Citizen Report" | "Civic App"
  content: string
  timestamp: string
  location?: string
}

const rawData: RawDataItem[] = [
  {
    id: "1",
    source: "Twitter",
    content: "Insane traffic on Outer Ring Road near Marathahalli. Cars not moving.",
    timestamp: "2 mins ago",
    location: "Marathahalli",
  },
  {
    id: "2",
    source: "Twitter",
    content: "BRO MG Road is jammed af! Avoid it!",
    timestamp: "3 mins ago",
    location: "MG Road",
  },
  {
    id: "3",
    source: "Citizen Report",
    content: "Uploaded photo of a waterlogged road near Indiranagar.",
    timestamp: "5 mins ago",
    location: "Indiranagar",
  },
  {
    id: "4",
    source: "Civic App",
    content: "5 reports of power outage in HSR Layout.",
    timestamp: "7 mins ago",
    location: "HSR Layout",
  },
  {
    id: "5",
    source: "Twitter",
    content: "Whole block in HSR gone dark. Is it BESCOM again?",
    timestamp: "8 mins ago",
    location: "HSR Layout",
  },
  {
    id: "6",
    source: "Twitter",
    content: "Flash mob happening near Church Street. It's wild 🎉",
    timestamp: "10 mins ago",
    location: "Church Street",
  },
]

const processedEvents: ProcessedEvent[] = [
  {
    id: "evt-1",
    type: "Traffic",
    title: "Severe Traffic Congestion",
    location: "Outer Ring Road & MG Road",
    urgency: "High",
    description: "Multiple reports of standstill traffic on major arterial roads",
    advice: "Use alternate routes: Intermediate Ring Road or Inner Ring Road. Consider metro/public transport.",
    prediction: "Traffic likely to persist for 45-60 minutes due to peak hour confluence",
    affectedAreas: ["Marathahalli", "MG Road", "Koramangala", "BTM Layout"],
    estimatedDuration: "45-60 mins",
  },
  {
    id: "evt-2",
    type: "Infrastructure",
    title: "Power Outage",
    location: "HSR Layout",
    urgency: "Medium",
    description: "Widespread power outage affecting residential blocks",
    advice: "Contact BESCOM helpline: 1912. Use UPS/inverter backup. Avoid using elevators.",
    prediction: "Restoration expected within 2-3 hours based on historical BESCOM response times",
    affectedAreas: ["HSR Layout Sector 1", "HSR Layout Sector 2"],
    estimatedDuration: "2-3 hours",
  },
  {
    id: "evt-3",
    type: "Weather",
    title: "Localized Waterlogging",
    location: "Indiranagar",
    urgency: "Medium",
    description: "Road waterlogging reported after recent rainfall",
    advice: "Avoid 100 Feet Road area. Use CMH Road or Old Airport Road as alternatives.",
    prediction: "Water levels should recede in 30-45 minutes if no additional rainfall",
    affectedAreas: ["Indiranagar 100 Feet Road"],
    estimatedDuration: "30-45 mins",
  },
  {
    id: "evt-4",
    type: "Event",
    title: "Flash Mob Activity",
    location: "Church Street",
    urgency: "Low",
    description: "Spontaneous gathering causing minor pedestrian congestion",
    advice: "Expect minor delays in Brigade Road area. Event appears peaceful and temporary.",
    affectedAreas: ["Church Street", "Brigade Road"],
    estimatedDuration: "15-30 mins",
  },
]

export default function CityPulseAI() {
  const [isProcessing, setIsProcessing] = useState(true)
  const [showProcessed, setShowProcessed] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [highContrast, setHighContrast] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [language, setLanguage] = useState<"en" | "kn">("en")

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsProcessing(false)
      setShowProcessed(true)
      if (soundEnabled) {
        // Accessibility: Audio notification when processing completes
        const utterance = new SpeechSynthesisUtterance("Analysis complete. New city events available.")
        speechSynthesis.speak(utterance)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [soundEnabled])

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, 24))
  }

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, 12))
  }

  const toggleHighContrast = () => {
    setHighContrast((prev) => !prev)
  }

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev)
  }

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "kn" : "en"))
  }

  const getUrgencyColor = (urgency: string) => {
    const baseColors = {
      Critical: highContrast
        ? "bg-black text-white border-4 border-red-600"
        : "bg-gradient-to-r from-red-500 to-red-600 shadow-lg",
      High: highContrast
        ? "bg-black text-white border-4 border-orange-600"
        : "bg-gradient-to-r from-orange-500 to-red-500 shadow-lg",
      Medium: highContrast
        ? "bg-black text-white border-4 border-yellow-600"
        : "bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg",
      Low: highContrast
        ? "bg-black text-white border-4 border-green-600"
        : "bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg",
    }
    return (
      baseColors[urgency as keyof typeof baseColors] ||
      (highContrast
        ? "bg-black text-white border-4 border-gray-600"
        : "bg-gradient-to-r from-gray-500 to-gray-600 shadow-lg")
    )
  }

  const getEventIcon = (type: string) => {
    const iconProps = { className: "h-5 w-5", "aria-hidden": "true" }
    switch (type) {
      case "Traffic":
        return <Car {...iconProps} />
      case "Weather":
        return <Droplets {...iconProps} />
      case "Infrastructure":
        return <Power {...iconProps} />
      case "Event":
        return <Users {...iconProps} />
      default:
        return <AlertTriangle {...iconProps} />
    }
  }

  const getSourceBadgeColor = (source: string) => {
    if (highContrast) {
      return "bg-black text-white border-2 border-white"
    }
    switch (source) {
      case "Twitter":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg border border-blue-300"
      case "Citizen Report":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg border border-green-300"
      case "Civic App":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg border border-purple-300"
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg border border-gray-300"
    }
  }

  const containerClass = highContrast
    ? "min-h-screen bg-black text-white p-4"
    : "min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 via-blue-50 to-green-50 p-4"

  return (
    <div className={containerClass} style={{ fontSize: `${fontSize}px` }}>
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50"
      >
        Skip to main content
      </a>

      <div className="max-w-7xl mx-auto">
        {/* Accessibility Controls */}
        <div
          className="flex flex-wrap gap-2 mb-4 p-4 bg-white/80 rounded-lg shadow-sm"
          role="toolbar"
          aria-label="Accessibility controls"
        >
          <Button
            onClick={decreaseFontSize}
            variant="outline"
            size="sm"
            aria-label="Decrease font size"
            className="focus:ring-2 focus:ring-blue-500 bg-transparent"
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
            <span className="ml-1">A-</span>
          </Button>

          <Button
            onClick={increaseFontSize}
            variant="outline"
            size="sm"
            aria-label="Increase font size"
            className="focus:ring-2 focus:ring-blue-500 bg-transparent"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span className="ml-1">A+</span>
          </Button>

          <Button
            onClick={toggleHighContrast}
            variant="outline"
            size="sm"
            aria-label={highContrast ? "Disable high contrast" : "Enable high contrast"}
            className="focus:ring-2 focus:ring-blue-500 bg-transparent"
          >
            {highContrast ? "Normal" : "High Contrast"}
          </Button>

          <Button
            onClick={toggleSound}
            variant="outline"
            size="sm"
            aria-label={soundEnabled ? "Disable sound notifications" : "Enable sound notifications"}
            className="focus:ring-2 focus:ring-blue-500 bg-transparent"
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4" aria-hidden="true" />
            ) : (
              <VolumeX className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="ml-1">{soundEnabled ? "Sound On" : "Sound Off"}</span>
          </Button>

          <Button
            onClick={toggleLanguage}
            variant="outline"
            size="sm"
            aria-label={`Switch to ${language === "en" ? "Kannada" : "English"}`}
            className="focus:ring-2 focus:ring-blue-500 bg-transparent"
          >
            {language === "en" ? "ಕನ್ನಡ" : "English"}
          </Button>
        </div>

        {/* Header */}
        <header className="text-center mb-8" role="banner">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className={`w-12 h-12 ${highContrast ? "bg-white text-black" : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"} rounded-full flex items-center justify-center shadow-lg`}
            >
              <span className="font-bold text-xl" aria-hidden="true">
                G
              </span>
            </div>
            <div>
              <h1
                className={`text-4xl font-bold mb-1 ${highContrast ? "text-white" : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"}`}
              >
                CityPulse.AI
              </h1>
              <p className="text-lg text-gray-600">ಸಿಟಿಪಲ್ಸ್.ಎಐ</p>
            </div>
          </div>
          <h2 className="text-xl text-gray-700 mb-2">
            {language === "en" ? "Bengaluru Real-time Synthesis" : "ಬೆಂಗಳೂರು ನೈಜ-ಸಮಯ ಸಂಶ್ಲೇಷಣೆ"}
          </h2>
          <div
            className={`flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-full ${highContrast ? "bg-white text-black" : "bg-gradient-to-r from-green-100 to-blue-100"}`}
          >
            <div
              className={`w-2 h-2 rounded-full animate-pulse ${highContrast ? "bg-green-600" : "bg-gradient-to-r from-green-500 to-blue-500"}`}
              aria-hidden="true"
            ></div>
            <span
              className={`font-medium ${highContrast ? "text-black" : "bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"}`}
            >
              {language === "en" ? "Powered by Gemini AI" : "ಜೆಮಿನಿ ಎಐ ನಿಂದ ಚಾಲಿತ"}
            </span>
          </div>
        </header>

        <main id="main-content" role="main">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Raw Data Input */}
            <section aria-labelledby="raw-data-heading">
              <Card
                className={`h-fit shadow-lg ${highContrast ? "bg-black border-4 border-white" : "border-2 border-gradient-to-r from-orange-200 to-red-200 bg-gradient-to-br from-orange-50 to-red-50"}`}
              >
                <CardHeader
                  className={`text-white rounded-t-lg ${highContrast ? "bg-gray-800" : "bg-gradient-to-r from-orange-500 to-red-500"}`}
                >
                  <CardTitle className="flex items-center gap-2" id="raw-data-heading">
                    <div
                      className={`h-3 w-3 rounded-full animate-pulse shadow-lg ${highContrast ? "bg-white" : "bg-white"}`}
                      aria-hidden="true"
                    ></div>
                    <div>
                      <div>{language === "en" ? "Incoming Raw Data" : "ಒಳಬರುವ ಕಚ್ಚಾ ಡೇಟಾ"}</div>
                      <div className="text-sm font-normal opacity-90" aria-hidden="true">
                        {language === "en" ? "Live data from multiple sources" : "ಬಹು ಮೂಲಗಳಿಂದ ನೈಜ ಡೇಟಾ"}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {rawData.map((item, index) => (
                    <article
                      key={item.id}
                      className={`border rounded-lg p-4 ${highContrast ? "bg-gray-900 border-white" : "bg-gray-50"}`}
                      aria-labelledby={`data-item-${index}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={`${getSourceBadgeColor(item.source)} text-sm px-3 py-1`}>{item.source}</Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4" aria-hidden="true" />
                          <time dateTime={item.timestamp}>{item.timestamp}</time>
                        </div>
                      </div>
                      <p
                        className={`text-base mb-3 leading-relaxed ${highContrast ? "text-white" : "text-gray-700"}`}
                        id={`data-item-${index}`}
                      >
                        {item.content}
                      </p>
                      {item.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="h-4 w-4" aria-hidden="true" />
                          <span>{item.location}</span>
                        </div>
                      )}
                    </article>
                  ))}
                </CardContent>
              </Card>
            </section>

            {/* AI Processing & Output */}
            <section aria-labelledby="ai-processing-heading">
              <Card
                className={`h-fit shadow-lg ${highContrast ? "bg-black border-4 border-white" : "border-2 border-gradient-to-r from-emerald-200 to-teal-200 bg-gradient-to-br from-emerald-50 to-teal-50"}`}
              >
                <CardHeader
                  className={`text-white rounded-t-lg ${highContrast ? "bg-gray-800" : "bg-gradient-to-r from-emerald-500 to-teal-500"}`}
                >
                  <CardTitle className="flex items-center gap-2" id="ai-processing-heading">
                    <div
                      className={`h-3 w-3 rounded-full shadow-lg ${isProcessing ? (highContrast ? "bg-yellow-400 animate-pulse" : "bg-yellow-300 animate-pulse") : highContrast ? "bg-white" : "bg-white"}`}
                      aria-hidden="true"
                    ></div>
                    <div>
                      <div>{language === "en" ? "Gemini AI Synthesis Engine" : "ಜೆಮಿನಿ ಎಐ ಸಂಶ್ಲೇಷಣೆ ಎಂಜಿನ್"}</div>
                      <div className="text-sm font-normal opacity-90" aria-hidden="true">
                        {language === "en" ? "AI-powered analysis and insights" : "ಎಐ-ಚಾಲಿತ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಒಳನೋಟಗಳು"}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isProcessing ? (
                    <div className="text-center py-8" role="status" aria-live="polite">
                      <div className="relative mx-auto mb-4 w-16 h-16">
                        <div
                          className={`absolute inset-0 rounded-full animate-spin ${highContrast ? "bg-white" : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"}`}
                          aria-hidden="true"
                        ></div>
                        <div
                          className={`absolute inset-2 rounded-full flex items-center justify-center ${highContrast ? "bg-black" : "bg-white"}`}
                        >
                          <span
                            className={`text-lg font-bold ${highContrast ? "text-white" : "bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"}`}
                            aria-hidden="true"
                          >
                            G
                          </span>
                        </div>
                      </div>
                      <p className={`font-medium mb-2 ${highContrast ? "text-white" : "text-gray-700"}`}>
                        {language === "en"
                          ? "Gemini AI Processing multi-source data..."
                          : "ಜೆಮಿನಿ ಎಐ ಬಹು-ಮೂಲ ಡೇಟಾವನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸುತ್ತಿದೆ..."}
                      </p>
                      <p className="text-sm text-gray-500">
                        {language === "en"
                          ? "Analyzing patterns • Cross-referencing locations • Generating insights"
                          : "ಮಾದರಿಗಳನ್ನು ವಿಶ್ಲೇಷಿಸುವುದು • ಸ್ಥಳಗಳನ್ನು ಅಡ್ಡ-ಉಲ್ಲೇಖಿಸುವುದು • ಒಳನೋಟಗಳನ್ನು ಉತ್ಪಾದಿಸುವುದು"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center mb-4">
                        <Badge
                          className={`px-4 py-2 shadow-lg text-base ${highContrast ? "bg-green-600 text-white border-2 border-white" : "bg-gradient-to-r from-green-500 to-emerald-500 text-white"}`}
                        >
                          ✓ {language === "en" ? "Gemini Analysis Complete" : "ಜೆಮಿನಿ ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ"}
                        </Badge>
                      </div>

                      {showProcessed && (
                        <div className="space-y-6" role="region" aria-labelledby="processed-events-heading">
                          <h3 id="processed-events-heading" className="sr-only">
                            {language === "en" ? "Processed Events" : "ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಿದ ಘಟನೆಗಳು"}
                          </h3>
                          {processedEvents.map((event, index) => (
                            <article
                              key={event.id}
                              className={`border rounded-lg p-4 shadow-sm ${highContrast ? "bg-gray-900 border-white" : "bg-white"}`}
                              aria-labelledby={`event-title-${index}`}
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  {getEventIcon(event.type)}
                                  <h4
                                    className={`font-semibold text-lg ${highContrast ? "text-white" : "text-gray-900"}`}
                                    id={`event-title-${index}`}
                                  >
                                    {event.title}
                                  </h4>
                                </div>
                                <Badge
                                  className={`${getUrgencyColor(event.urgency)} text-white text-sm px-3 py-1`}
                                  aria-label={`Urgency level: ${event.urgency}`}
                                >
                                  {event.urgency}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-2 text-base text-gray-600 mb-3">
                                <MapPin className="h-4 w-4" aria-hidden="true" />
                                <span>{event.location}</span>
                              </div>

                              <p
                                className={`text-base mb-4 leading-relaxed ${highContrast ? "text-white" : "text-gray-700"}`}
                              >
                                {event.description}
                              </p>

                              <div
                                className={`border rounded-lg p-4 mb-4 shadow-sm ${highContrast ? "bg-blue-900 border-blue-400" : "bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200"}`}
                              >
                                <h5
                                  className={`font-medium mb-2 flex items-center gap-2 ${highContrast ? "text-white" : "text-blue-900"}`}
                                >
                                  <span aria-hidden="true">💡</span>
                                  <span>{language === "en" ? "Actionable Advice" : "ಕ್ರಿಯಾಶೀಲ ಸಲಹೆ"}</span>
                                </h5>
                                <p
                                  className={`text-base leading-relaxed ${highContrast ? "text-white" : "text-blue-800"}`}
                                >
                                  {event.advice}
                                </p>
                              </div>

                              {event.prediction && (
                                <div
                                  className={`border rounded-lg p-4 mb-4 shadow-sm ${highContrast ? "bg-purple-900 border-purple-400" : "bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200"}`}
                                >
                                  <h5
                                    className={`font-medium mb-2 flex items-center gap-2 ${highContrast ? "text-white" : "text-purple-900"}`}
                                  >
                                    <span aria-hidden="true">🔮</span>
                                    <span>{language === "en" ? "Gemini Prediction" : "ಜೆಮಿನಿ ಭವಿಷ್ಯವಾಣಿ"}</span>
                                  </h5>
                                  <p
                                    className={`text-base leading-relaxed ${highContrast ? "text-white" : "text-purple-800"}`}
                                  >
                                    {event.prediction}
                                  </p>
                                </div>
                              )}

                              <div className="flex flex-wrap gap-2 text-sm mb-3">
                                <span className="text-gray-500 font-medium">
                                  {language === "en" ? "Affected Areas:" : "ಪರಿಣಾಮಿತ ಪ್ರದೇಶಗಳು:"}
                                </span>
                                {event.affectedAreas.map((area, areaIndex) => (
                                  <Badge key={areaIndex} variant="outline" className="text-sm px-2 py-1">
                                    {area}
                                  </Badge>
                                ))}
                              </div>

                              {event.estimatedDuration && (
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                  <span aria-hidden="true">⏱️</span>
                                  <span>
                                    {language === "en" ? "Est. Duration:" : "ಅಂದಾಜು ಅವಧಿ:"} {event.estimatedDuration}
                                  </span>
                                </div>
                              )}
                            </article>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Interactive Map */}
          {showProcessed && (
            <section className="mt-6" aria-labelledby="map-heading">
              <Card
                className={`shadow-xl ${highContrast ? "bg-black border-4 border-white" : "border-2 border-gradient-to-r from-indigo-200 to-purple-200"}`}
              >
                <CardHeader
                  className={`text-white rounded-t-lg ${highContrast ? "bg-gray-800" : "bg-gradient-to-r from-indigo-500 to-purple-500"}`}
                >
                  <CardTitle className="flex items-center gap-2" id="map-heading">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                    <div>
                      <div>{language === "en" ? "Live Event Map" : "ನೈಜ ಸಮಯದ ಘಟನೆ ನಕ್ಷೆ"}</div>
                      <div className="text-sm font-normal opacity-90" aria-hidden="true">
                        {language === "en" ? "Interactive map showing all events" : "ಎಲ್ಲಾ ಘಟನೆಗಳನ್ನು ತೋರಿಸುವ ಸಂವಾದಾತ್ಮಕ ನಕ್ಷೆ"}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div
                    className="h-96 w-full"
                    role="img"
                    aria-label="Interactive map showing event locations in Bengaluru"
                  >
                    <MapComponent events={processedEvents} />
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Summary Stats */}
          {showProcessed && (
            <section className="mt-6" aria-labelledby="summary-heading">
              <Card
                className={`shadow-xl ${highContrast ? "bg-black border-4 border-white" : "border-2 border-gradient-to-r from-yellow-200 to-orange-200"}`}
              >
                <CardHeader
                  className={`text-white rounded-t-lg ${highContrast ? "bg-gray-800" : "bg-gradient-to-r from-yellow-500 to-orange-500"}`}
                >
                  <CardTitle id="summary-heading">
                    <div>{language === "en" ? "City Status Summary" : "ನಗರ ಸ್ಥಿತಿ ಸಾರಾಂಶ"}</div>
                    <div className="text-sm font-normal opacity-90" aria-hidden="true">
                      {language === "en" ? "Current city monitoring statistics" : "ಪ್ರಸ್ತುತ ನಗರ ಮೇಲ್ವಿಚಾರಣೆ ಅಂಕಿಅಂಶಗಳು"}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className={highContrast ? "bg-black" : "bg-gradient-to-br from-yellow-50 to-orange-50"}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4" role="list">
                    <div
                      className={`text-center p-6 rounded-lg shadow-md border ${highContrast ? "bg-gray-900 border-red-400" : "bg-gradient-to-br from-red-100 to-red-200 border border-red-300"}`}
                      role="listitem"
                    >
                      <div
                        className={`text-4xl font-bold mb-2 ${highContrast ? "text-red-400" : "bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent"}`}
                      >
                        2
                      </div>
                      <div className={`text-base font-medium mb-1 ${highContrast ? "text-white" : "text-red-700"}`}>
                        {language === "en" ? "High Priority Events" : "ಹೆಚ್ಚಿನ ಆದ್ಯತೆಯ ಘಟನೆಗಳು"}
                      </div>
                    </div>
                    <div
                      className={`text-center p-6 rounded-lg shadow-md border ${highContrast ? "bg-gray-900 border-yellow-400" : "bg-gradient-to-br from-yellow-100 to-yellow-200 border border-yellow-300"}`}
                      role="listitem"
                    >
                      <div
                        className={`text-4xl font-bold mb-2 ${highContrast ? "text-yellow-400" : "bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent"}`}
                      >
                        2
                      </div>
                      <div className={`text-base font-medium mb-1 ${highContrast ? "text-white" : "text-yellow-700"}`}>
                        {language === "en" ? "Medium Priority Events" : "ಮಧ್ಯಮ ಆದ್ಯತೆಯ ಘಟನೆಗಳು"}
                      </div>
                    </div>
                    <div
                      className={`text-center p-6 rounded-lg shadow-md border ${highContrast ? "bg-gray-900 border-blue-400" : "bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-300"}`}
                      role="listitem"
                    >
                      <div
                        className={`text-4xl font-bold mb-2 ${highContrast ? "text-blue-400" : "bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent"}`}
                      >
                        8
                      </div>
                      <div className={`text-base font-medium mb-1 ${highContrast ? "text-white" : "text-blue-700"}`}>
                        {language === "en" ? "Areas Monitored" : "ಮೇಲ್ವಿಚಾರಣೆಯಲ್ಲಿರುವ ಪ್ರದೇಶಗಳು"}
                      </div>
                    </div>
                    <div
                      className={`text-center p-6 rounded-lg shadow-md border ${highContrast ? "bg-gray-900 border-green-400" : "bg-gradient-to-br from-green-100 to-green-200 border border-green-300"}`}
                      role="listitem"
                    >
                      <div
                        className={`text-4xl font-bold mb-2 ${highContrast ? "text-green-400" : "bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent"}`}
                      >
                        6
                      </div>
                      <div className={`text-base font-medium mb-1 ${highContrast ? "text-white" : "text-green-700"}`}>
                        {language === "en" ? "Data Sources Active" : "ಸಕ್ರಿಯ ಡೇಟಾ ಮೂಲಗಳು"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer
          className={`text-center mt-8 p-6 rounded-lg shadow-lg ${highContrast ? "bg-gray-900 border border-white" : "bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100"}`}
          role="contentinfo"
        >
          <p className={`font-medium mb-2 ${highContrast ? "text-white" : "text-gray-700"}`}>
            {language === "en"
              ? "CityPulse.AI • Real-time city intelligence for smarter urban living"
              : "ಸಿಟಿಪಲ್ಸ್.ಎಐ • ಸ್ಮಾರ್ಟ್ ನಗರ ಜೀವನಕ್ಕಾಗಿ ನೈಜ-ಸಮಯದ ನಗರ ಬುದ್ಧಿವಂತಿಕೆ"}
          </p>
          <div className="flex items-center justify-center gap-2">
            <div
              className={`w-2 h-2 rounded-full animate-pulse ${highContrast ? "bg-green-400" : "bg-gradient-to-r from-blue-500 to-purple-500"}`}
              aria-hidden="true"
            ></div>
            <p className="text-sm text-gray-500">
              {language === "en" ? "Powered by Gemini AI" : "ಜೆಮಿನಿ ಎಐ ನಿಂದ ಚಾಲಿತ"} •
              {language === "en" ? "Last updated:" : "ಕೊನೆಯ ನವೀಕರಣ:"} {new Date().toLocaleTimeString()}
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
