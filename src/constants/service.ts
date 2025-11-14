import { Monitor, Server, Database, Cloud, Bot, LucideIcon } from 'lucide-react';

interface Service {
  icon: LucideIcon;
  iconColor: string;
  content: {
    text: string;
    highlight?: boolean;
  }[];
  colSpan?: string;
}

export const services: Service[] = [
  {
    icon: Monitor,
    iconColor: 'text-white',
    content: [
      { text: 'Clean, polished ' },
      { text: 'UI/UX designs', highlight: false }
    ],
  },
  {
    icon: Server,
    iconColor: 'text-white',
    content: [
      { text: 'Robust backend solutions with ' },
      { text: 'Express.js', highlight: false },
      { text: ' & ' },
      { text: 'Node.js', highlight: false },
    ],
  },
  {
    icon: Database,
    iconColor: 'text-white',
    content: [
      { text: 'Database architecture using ' },
      { text: 'MongoDB', highlight: false },
      { text: ' & ' },
      { text: 'Supabase', highlight: false },
    ],
  },
  {
    icon: Cloud,
    iconColor: 'text-white',
    content: [
      { text: 'Deployment on ' },
      { text: 'VPS', highlight: false },
      { text: ' (Linode, DigitalOcean, Hostinger) & ' },
      { text: 'AWS', highlight: false },
    ],
  },
  {
    icon: Bot,
    iconColor: 'text-white',
    content: [
      { text: 'Build and integrate ' },
      { text: 'AI agents', highlight: false },
      { text: ' into existing websites for enhanced functionality' },
    ],
    colSpan: 'md:col-span-2',
  },
];