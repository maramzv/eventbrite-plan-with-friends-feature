export type FriendStatus = 'Going' | 'Interested' | 'Pending'

export type Friend = {
  name: string
  status: FriendStatus
}

export type FriendPlan = {
  id: string
  eventId: string
  createdAt: string
  friends: Friend[]
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

/** Adds a friend to an existing plan with a default 'Pending' status. */
export function addFriendToPlan(planId: string, friendName: string): FriendPlan | null {
  const plans = readPlans()
  const plan = plans.find((p) => p.id === planId)
  if (!plan || !friendName.trim()) return null

  // Support backward compatibility if old plans stored strings
  plan.friends = plan.friends.map((f) => 
    typeof f === 'string' ? { name: f, status: 'Pending' as FriendStatus } : f
  )

  plan.friends.push({ name: friendName.trim(), status: 'Pending' })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
  return plan
}

/** Updates a friend's interest status in the plan. */
export function updateFriendStatus(planId: string, friendIndex: number, status: FriendStatus): FriendPlan | null {
  const plans = readPlans()
  const plan = plans.find((p) => p.id === planId)
  if (!plan || !plan.friends[friendIndex]) return null

  // Ensure items are objects
  plan.friends = plan.friends.map((f) => 
    typeof f === 'string' ? { name: f, status: 'Pending' as FriendStatus } : f
  )

  plan.friends[friendIndex].status = status
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
  return plan
}