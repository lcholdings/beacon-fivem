// QBox Player Types
// Source: https://docs.qbox.re/resources/qbx_core/types/player
export interface PlayerJobGangGrade {
  name: string
  level: number
}

export interface PlayerJob {
  name: string
  label: string
  payment: number
  type?: string
  onduty: boolean
  isboss: boolean
  grade: PlayerJobGangGrade
}

export interface PlayerGang {
  name: string
  label: string
  isboss: boolean
  grade: PlayerJobGangGrade
}

export interface PlayerEntity {
  citizenid: string
  license: string
  name: string
  money: Record<string, number>
  cash: number
  bank: number
  crypto: number
  charinfo: {
    firstname: string
    lastname: string
    birthdate: string
    nationality: string
    cid: number
    gender: number
    backstory: string
    phone: string
    account: string
    card: number
  }
  job: PlayerJob
  jobs: Record<string, number>
  gang: PlayerGang
  gangs: Record<string, number>
  position: [number, number, number, number]
  metadata: Record<string, any>
  health: number
  armor: number
  hunger: number
  thirst: number
  stress: number
  isdead: boolean
  inlaststand: boolean
  ishandcuffed: boolean
  tracker: boolean
  injail: number
  jailitems: Record<string, any>
  status: Record<string, any>
  phone: Record<string, any>
  background: any
  profilepicture: any
  bloodtype: string
  dealerrep: number
  craftingrep: number
  attachmentcraftingrep: number
  currentapartment?: number
  jobrep: Record<string, number>
  tow: number
  trucker: number
  taxi: number
  hotdog: number
  callsign: string
  fingerprint: string
  walletid: string
  criminalrecord: Record<string, any>
  hasRecord: number
  date?: Record<string, any>
  licences: {
    id: boolean
    driver: boolean
    weapon: boolean
  }
  inside: Record<string, any>
  house?: any
  apartment: Record<string, any>
  apartmentType?: any
  apartmentId?: number
  phonedata: Record<string, any>
  SerialNumber: string
  InstalledApps: Record<string, any>
  cid: number
  items: Record<string, any>
  lastLoggedOut: number
}

export interface PlayerData extends PlayerEntity {
  source?: number
  optin?: boolean
}

export interface Player {
  Functions: Record<string, any>
  PlayerData: PlayerData
  Offline: boolean
}
