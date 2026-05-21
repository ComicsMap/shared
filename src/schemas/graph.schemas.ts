import { LodLevel } from '@/types';
import { z } from 'zod';

const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

const boundsSchema = z.object({
  xMin: z.number(),
  xMax: z.number(),
  yMin: z.number(),
  yMax: z.number(),
});

export const lodLevelSchema = z.enum(LodLevel);

export const detailNodeSchema = z.object({
  kind: z.literal(LodLevel.Detail),
  uuid: z.uuid(),
  position: positionSchema,
  communityId: z.number().int(),
  componentId: z.number().int(),
  seriesUuid: z.string().nullish(),
  seriesDisplayTitle: z.string().nullish(),
  data: z.object({
    title: z.string(),
    publishedAt: z.date(),
    coverUrl: z.string().nullish(),
  }),
});

export const clusterNodeSchema = z.object({
  kind: z.literal(LodLevel.Cluster),
  communityId: z.number().int(),
  componentId: z.number().int(),
  position: positionSchema,
  bbox: boundsSchema,
  nodeCount: z.number().int(),
});

export const graphNodeSchema = z.discriminatedUnion('kind', [
  detailNodeSchema,
  clusterNodeSchema,
]);

export const graphEdgeSchema = z.object({
  uuid: z.string(),
  source: z.uuid(),
  target: z.uuid(),
});

/** Get Meta Schemas */

export const getMetaResponseSchema = z.object({
  bounds: boundsSchema.describe('The bounding box of the entire graph'),
});

/** Get Window Schemas */

export const getWindowQuerySchema = z.object({
  xMin: z.coerce.number().describe('Fetch bbox min x'),
  xMax: z.coerce.number().describe('Fetch bbox max x'),
  yMin: z.coerce.number().describe('Fetch bbox min y'),
  yMax: z.coerce.number().describe('Fetch bbox max y'),
  visibleXMin: z.coerce
    .number()
    .optional()
    .describe('Visible viewport min x (used for LOD; defaults to xMin)'),
  visibleXMax: z.coerce
    .number()
    .optional()
    .describe('Visible viewport max x (used for LOD; defaults to xMax)'),
  visibleYMin: z.coerce
    .number()
    .optional()
    .describe('Visible viewport min y (used for LOD; defaults to yMin)'),
  visibleYMax: z.coerce
    .number()
    .optional()
    .describe('Visible viewport max y (used for LOD; defaults to yMax)'),
  zoom: z.coerce
    .number()
    .optional()
    .describe('Current zoom level (informational, not used server-side)'),
  componentId: z.coerce
    .number()
    .int()
    .optional()
    .describe('Restrict to a single connected component'),
  maxNodes: z.coerce
    .number()
    .int()
    .min(1)
    .max(2000)
    .default(500)
    .describe('Maximum nodes returned in detail mode'),
});
export const getWindowResponseSchema = z.object({
  lodLevel: lodLevelSchema,
  nodes: z.array(graphNodeSchema),
  edges: z.array(graphEdgeSchema),
  meta: z.object({
    truncated: z.boolean(),
    totalInWindow: z.number().int(),
  }),
});
