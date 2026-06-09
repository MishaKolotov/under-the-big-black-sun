import type { GlobalConfig } from 'payload'
import { isAdmin, anyone } from '../access'

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: { read: anyone, update: isAdmin },
  fields: [
    {
      name: 'moderateComments',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'On = new comments wait for approval. Off = auto-approved.' },
    },
  ],
}
