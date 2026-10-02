export type FriendPlan = {
  id: string
  eventId: string
  createdAt: string
  friends: string[]
}

const STORAGE_KEY = 'pwf-plans'

function readPlans(): FriendPlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as FriendPlan[]) : []
  } catch {
    return []
  }
}

/** Creates a plan record linked to the given Eventbrite event id. */
export function createPlan(eventId: string): FriendPlan {
  const plan: FriendPlan = {
    id: crypto.randomUUID(),
    eventId,
    createdAt: new Date().toISOString(),
    friends: [],
  }
  const plans = readPlans()
  plans.push(plan)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
  return plan
}

/** Retrieves an existing plan by its ID. */
export function getPlanById(id: string): FriendPlan | null {
  const plans = readPlans()
  return plans.find((p) => p.id === id) || null
}