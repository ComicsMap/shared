import * as Schemas from '@schemas/graph.schemas';
import { z } from 'zod';

export enum LodLevel {
  Detail = 'detail',
  Cluster = 'cluster',
}

export type DetailNode = z.infer<typeof Schemas.detailNodeSchema>;
export type ClusterNode = z.infer<typeof Schemas.clusterNodeSchema>;
export type GraphNode = z.infer<typeof Schemas.graphNodeSchema>;
export type GraphEdge = z.infer<typeof Schemas.graphEdgeSchema>;

/** Get Meta Types */

export type GetMetaResponse = z.infer<typeof Schemas.getMetaResponseSchema>;

/** Get Window Types */

export type GetWindowQuery = z.infer<typeof Schemas.getWindowQuerySchema>;
export type GetWindowResponse = z.infer<typeof Schemas.getWindowResponseSchema>;
