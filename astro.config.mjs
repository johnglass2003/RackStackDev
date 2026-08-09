// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://rackstackdev.com',
	integrations: [
		starlight({
			title: 'rackstackdev',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{ label: 'Linux & Systems', items: [{ autogenerate: { directory: 'linux-systems' } }] },
				{ label: 'Scripting & Automation', items: [{ autogenerate: { directory: 'scripting-automation' } }] },
				{ label: 'BMC/Redfish/IPMI', items: [{ autogenerate: { directory: 'bmc-redfish-ipmi' } }] },
				{ label: 'Firmware & Troubleshooting', items: [{ autogenerate: { directory: 'firmware-troubleshooting' } }] },
				{ label: 'Telemetry & Monitoring', items: [{ autogenerate: { directory: 'telemetry-monitoring' } }] },
				{ label: 'Networking', items: [{ autogenerate: { directory: 'networking' } }] },
				{ label: 'Rust', items: [{ autogenerate: { directory: 'rust' } }] },
			],
		}),
	],
});
