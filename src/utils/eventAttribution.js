/**
 * Determines attribution display (prepositions and names) for event types.
 * Returns an object describing how to render "to/by/for" attribution.
 *
 * @param {string} eventType - Asset event type.
 * @param {string} triggeredByName - Name of user who triggered the event.
 * @param {string|null|undefined} targetEmployeeName - Name of target employee (if any).
 * @returns {{ segments: Array<{ preposition: string, name: string, isBold: boolean }> }}
 */
export function getEventAttribution(eventType, triggeredByName, targetEmployeeName) {
  const segments = []

  switch (eventType) {
    case 'registered':
      // Only "by AdminName"
      segments.push({ preposition: 'by', name: triggeredByName, isBold: true })
      break

    case 'assigned':
      // "to EmployeeName by AdminName"
      if (targetEmployeeName) {
        segments.push({ preposition: 'to', name: targetEmployeeName, isBold: true })
      }
      segments.push({ preposition: 'by', name: triggeredByName, isBold: true })
      break

    case 'ticket_opened':
      // Only "by EmployeeName"
      segments.push({ preposition: 'by', name: triggeredByName, isBold: true })
      break

    case 'repair_started':
    case 'repair_completed':
      // "for EmployeeName by AdminName"
      if (targetEmployeeName) {
        segments.push({ preposition: 'for', name: targetEmployeeName, isBold: true })
      }
      segments.push({ preposition: 'by', name: triggeredByName, isBold: true })
      break

    case 'returned':
      // "by EmployeeName to AdminName"
      // Note: Backend has triggeredBy=admin, targetEmployee=employee
      // Display as: by employee, to admin
      if (targetEmployeeName) {
        segments.push({ preposition: 'by', name: targetEmployeeName, isBold: true })
      }
      segments.push({ preposition: 'to', name: triggeredByName, isBold: true })
      break

    case 'acknowledged':
      // "by EmployeeName"
      // (Target employee and triggered-by are the same person for acknowledged events)
      segments.push({ preposition: 'by', name: triggeredByName, isBold: true })
      break

    default:
      // Fallback: "to EmployeeName by TriggeredByName" (original behavior)
      if (targetEmployeeName) {
        segments.push({ preposition: 'to', name: targetEmployeeName, isBold: true })
      }
      segments.push({ preposition: 'by', name: triggeredByName, isBold: true })
      break
  }

  return { segments }
}
