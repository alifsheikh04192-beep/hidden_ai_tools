import toolsData from '@/data/tools.json';

export type ToolCategory =
  | 'Video'
  | 'Photo'
  | 'Cartoon'
  | '3D'
  | 'Audio'
  | 'Automation'
  | 'Coding'
  | 'Text'
  | 'Design';

export interface ToolPrompt {
  label: string;
  value: string;
}

export interface WorkflowStep {
  title: string;
  detail: string;
}

export interface AITool {
  id: string;
  name: string;
  tagline: string;
  category: ToolCategory;
  free: boolean;
  url: string;
  emoji: string;
  promptPresets: ToolPrompt[];
  negativeSeed?: string;
  workflow: WorkflowStep[];
  parameters?: { label: string; value: string }[];
}

export const ALL_TOOLS: AITool[] = toolsData as AITool[];

export const INITIAL_TOOLS: AITool[] = ALL_TOOLS;

export const CATEGORY_PILLS: { label: string; value: ToolCategory | 'All' }[] = [
  { label: 'All', value: 'All' },
  { label: 'Video', value: 'Video' },
  { label: 'Photo', value: 'Photo' },
  { label: 'Cartoon', value: 'Cartoon' },
  { label: '3D', value: '3D' },
  { label: 'Audio', value: 'Audio' },
  { label: 'Automation', value: 'Automation' },
  { label: 'Coding', value: 'Coding' },
  { label: 'Text', value: 'Text' },
  { label: 'Design', value: 'Design' },
];

export const PAGE_SIZE = 9;

// Pool of tools that the sync engine can "discover" and inject live.
export const SYNC_POOL: AITool[] = [
  {
    id: 'luma-dream-sync',
    name: 'Luma Dream Machine',
    tagline: 'Just-launched: photoreal video with physics-aware camera moves.',
    category: 'Video',
    free: false,
    url: 'https://lumalabs.ai',
    emoji: '🎬',
    promptPresets: [
      {
        label: 'Physics-aware flythrough',
        value:
          'fly through a foggy pine forest at dawn, physics-accurate branch sway, soft volumetric light, 6s 24fps',
      },
    ],
    negativeSeed: 'physics glitches, branch clipping, flickering shadows',
    workflow: [
      { title: 'Prompt or upload', detail: 'Text-to-video or image-to-video.' },
      { title: 'Pick camera', detail: 'Orbit, dolly, or free-fly.' },
      { title: 'Render', detail: '6s clips at 1080p.' },
    ],
    parameters: [
      { label: 'Length', value: '6s' },
      { label: 'FPS', value: '24' },
    ],
  },
  {
    id: 'hedra-song-sync',
    name: 'Hedra Singing Avatar',
    tagline: 'Just-launched: animate a still portrait into a lip-synced singing performance.',
    category: 'Cartoon',
    free: false,
    url: 'https://hedra.com',
    emoji: '🎤',
    promptPresets: [
      {
        label: 'Lip-sync performance',
        value:
          'animate portrait to sing provided audio, accurate lip sync, expressive brows, stable identity, 30s clip',
      },
    ],
    negativeSeed: 'mouth warp, identity drift, dead eyes, audio desync',
    workflow: [
      { title: 'Upload portrait', detail: 'Front-facing, neutral expression.' },
      { title: 'Add audio', detail: 'Vocals or TTS output.' },
      { title: 'Generate', detail: '30s lip-synced performance.' },
    ],
    parameters: [
      { label: 'Length', value: '30s' },
      { label: 'Sync', value: 'on' },
    ],
  },
  {
    id: 'rodin-3d-sync',
    name: 'Rodin Gen-1 3D',
    tagline: 'Just-launched: diffusion-based 3D avatar generation from a single photo.',
    category: '3D',
    free: false,
    url: 'https://hyperhuman.deemos.com',
    emoji: '👨‍💻',
    promptPresets: [
      {
        label: 'Avatar from selfie',
        value:
          'generate rigged 3D avatar from single selfie, PBR skin, ARKit blendshapes, 10k tris, T-pose ready for Mixamo',
      },
    ],
    negativeSeed: 'unrigged mesh, floating hair cards, mismatched skin tone',
    workflow: [
      { title: 'Upload selfie', detail: 'Front-facing, good lighting.' },
      { title: 'Generate mesh', detail: 'Diffusion produces a rigged avatar.' },
      { title: 'Export', detail: 'FBX with ARKit blendshapes.' },
    ],
    parameters: [
      { label: 'Triangles', value: '10k' },
      { label: 'Rig', value: 'ARKit' },
    ],
  },
  {
    id: 'sora-sync',
    name: 'OpenAI Sora Turbo',
    tagline: 'Just-launched: faster Sora variant with real-time prompt editing.',
    category: 'Video',
    free: false,
    url: 'https://openai.com/sora',
    emoji: '⚡',
    promptPresets: [
      {
        label: 'Rapid scene gen',
        value:
          'aerial shot over a neon city at night, rain reflections, flying car passes, 10s, photorealistic, cinematic',
      },
    ],
    negativeSeed: 'physics violations, morphing, scene cuts',
    workflow: [
      { title: 'Write a prompt', detail: 'Subject, camera, environment.' },
      { title: 'Iterate live', detail: 'Edit the prompt mid-generation.' },
      { title: 'Export', detail: 'Download 1080p MP4.' },
    ],
    parameters: [
      { label: 'Max length', value: '20s' },
      { label: 'Speed', value: 'Turbo' },
    ],
  },
  {
    id: 'udify-sync',
    name: 'Udify Voice Engine',
    tagline: 'Just-launched: zero-shot voice cloning from 3 seconds of audio.',
    category: 'Audio',
    free: false,
    url: 'https://udify.ai',
    emoji: '🎙️',
    promptPresets: [
      {
        label: 'Zero-shot clone',
        value:
          'clone voice from 3s sample, generate narration in 12 languages, emotion control: sad, happy, neutral, 44.1kHz',
      },
    ],
    negativeSeed: 'robotic tone, wrong emotion, accent bleed',
    workflow: [
      { title: 'Upload 3s sample', detail: 'Any clean speech.' },
      { title: 'Pick language + emotion', detail: '12 languages supported.' },
      { title: 'Generate', detail: 'Download WAV or MP3.' },
    ],
    parameters: [
      { label: 'Sample', value: '3s' },
      { label: 'Languages', value: '12' },
    ],
  },
];
