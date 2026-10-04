export type FriendStatus = 'Pending' | 'Interested' | 'Going'
export type FriendAvailability = 'Unknown' | 'Available' | 'Busy'

export interface Friend {
  name: string
  status: FriendStatus
  availability: FriendAvailability
  hasResponded: boolean
}

export interface Plan {
  id: string
  eventId: string
  organizerName?: string
  friends: Friend[]
  createdAt: string
}

const PLANS_STORAGE_KEY = 'eb_plans'

function getStoredPlans(): Plan[] {
  try {
    const data = localStorage.getItem(PLANS_STORAGE_KEY)
    return data ? (JSON.parse(data) as Plan[]) : []
  } catch {
    return []
  }
}

function saveStoredPlans(plans: Plan[]): void {
  try {
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans))
  } catch {
    // ignore
  }
}

export function createPlan(eventId: string, organizerName?: string): Plan {
  const plans = getStoredPlans()
  const newPlan: Plan = {
    id: Math.random().toString(36).substring(2, 9),
    eventId,
    organizerName: organizerName?.trim() || 'Your friend',
    friends: [],
    createdAt: new Date().toISOString(),
  }
  plans.push(newPlan)
  saveStoredPlans(plans)
  return newPlan
}

export function getPlanById(planId: string): Plan | null {
  const plans = getStoredPlans()
  return plans.find((p) => p.id === planId) || null
}

export function addFriendToPlan(planId: string, friendName: string): Plan | null {
  const plans = getStoredPlans()
  const plan = plans.find((p) => p.id === planId)
  if (!plan) return null

  const newFriend: Friend = {
    name: friendName.trim(),
    status: 'Pending',
    availability: 'Unknown',
    hasResponded: false,
  }

  plan.friends.push(newFriend)
  saveStoredPlans(plans)
  return plan
}

export function updateFriendStatus(planId: string, friendIndex: number, status: FriendStatus): Plan | null {
  const plans = getStoredPlans()
  const plan = plans.find((p) => p.id === planId)
  if (!plan || !plan.friends[friendIndex]) return null

  plan.friends[friendIndex].status = status
  plan.friends[friendIndex].hasResponded = true
  saveStoredPlans(plans)
  return plan
}

export function updateFriendAvailability(planId: string, friendIndex: number, availability: FriendAvailability): Plan | null {
  const plans = getStoredPlans()
  const plan = plans.find((p) => p.id === planId)
  if (!plan || !plan.friends[friendIndex]) return null

  plan.friends[friendIndex].availability = availability
  plan.friends[friendIndex].hasResponded = true
  saveStoredPlans(plans)
  return plan
}