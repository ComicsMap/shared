import { Migration } from '@mikro-orm/migrations';

export class Migration20260520175101 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "custom_collections" ("uuid" uuid not null default gen_random_uuid(), "owner_uuid" uuid not null, "updated_at" timestamptz not null default now(), "title" varchar(64) not null, "created_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "custom_collections_pkey" primary key ("uuid"));`);

    this.addSql(`create table "custom_collections_issues" ("custom_collection_uuid" uuid not null, "issue_uuid" uuid not null, "added_at" timestamptz not null default now(), constraint "custom_collections_issues_pkey" primary key ("custom_collection_uuid", "issue_uuid"));`);

    this.addSql(`create table "collections" ("uuid" uuid not null default gen_random_uuid(), "owner_uuid" uuid not null, "updated_at" timestamptz not null default now(), constraint "collections_pkey" primary key ("uuid"));`);
    this.addSql(`alter table "collections" add constraint "collections_owner_uuid_unique" unique ("owner_uuid");`);

    this.addSql(`create table "collections_issues" ("collection_uuid" uuid not null, "issue_uuid" uuid not null, "added_at" timestamptz not null default now(), constraint "collections_issues_pkey" primary key ("collection_uuid", "issue_uuid"));`);

    this.addSql(`create table "wishlists" ("uuid" uuid not null default gen_random_uuid(), "owner_uuid" uuid not null, "updated_at" timestamptz not null default now(), constraint "wishlists_pkey" primary key ("uuid"));`);
    this.addSql(`alter table "wishlists" add constraint "wishlists_owner_uuid_unique" unique ("owner_uuid");`);

    this.addSql(`create table "wishlists_issues" ("wishlist_uuid" uuid not null, "issue_uuid" uuid not null, "added_at" timestamptz not null default now(), constraint "wishlists_issues_pkey" primary key ("wishlist_uuid", "issue_uuid"));`);

    this.addSql(`alter table "custom_collections" add constraint "custom_collections_owner_uuid_foreign" foreign key ("owner_uuid") references "users" ("uuid") on update cascade on delete cascade;`);

    this.addSql(`alter table "custom_collections_issues" add constraint "custom_collections_issues_custom_collection_uuid_foreign" foreign key ("custom_collection_uuid") references "custom_collections" ("uuid") on update cascade on delete cascade;`);
    this.addSql(`alter table "custom_collections_issues" add constraint "custom_collections_issues_issue_uuid_foreign" foreign key ("issue_uuid") references "issues" ("uuid") on update cascade on delete cascade;`);

    this.addSql(`alter table "collections" add constraint "collections_owner_uuid_foreign" foreign key ("owner_uuid") references "users" ("uuid") on update cascade on delete cascade;`);

    this.addSql(`alter table "collections_issues" add constraint "collections_issues_collection_uuid_foreign" foreign key ("collection_uuid") references "collections" ("uuid") on update cascade on delete cascade;`);
    this.addSql(`alter table "collections_issues" add constraint "collections_issues_issue_uuid_foreign" foreign key ("issue_uuid") references "issues" ("uuid") on update cascade on delete cascade;`);

    this.addSql(`alter table "wishlists" add constraint "wishlists_owner_uuid_foreign" foreign key ("owner_uuid") references "users" ("uuid") on update cascade on delete cascade;`);

    this.addSql(`alter table "wishlists_issues" add constraint "wishlists_issues_wishlist_uuid_foreign" foreign key ("wishlist_uuid") references "wishlists" ("uuid") on update cascade on delete cascade;`);
    this.addSql(`alter table "wishlists_issues" add constraint "wishlists_issues_issue_uuid_foreign" foreign key ("issue_uuid") references "issues" ("uuid") on update cascade on delete cascade;`);

    this.addSql(`alter table "issue_contributors" drop constraint chk_cover_artist_requires_cover;`);

    this.addSql(`alter table "issue_contributors" add constraint chk_cover_artist_requires_cover check(role != 'COVER_ARTIST' OR cover_uuid IS NOT NULL);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "custom_collections_issues" drop constraint "custom_collections_issues_custom_collection_uuid_foreign";`);

    this.addSql(`alter table "collections_issues" drop constraint "collections_issues_collection_uuid_foreign";`);

    this.addSql(`alter table "wishlists_issues" drop constraint "wishlists_issues_wishlist_uuid_foreign";`);

    this.addSql(`drop table if exists "custom_collections" cascade;`);

    this.addSql(`drop table if exists "custom_collections_issues" cascade;`);

    this.addSql(`drop table if exists "collections" cascade;`);

    this.addSql(`drop table if exists "collections_issues" cascade;`);

    this.addSql(`drop table if exists "wishlists" cascade;`);

    this.addSql(`drop table if exists "wishlists_issues" cascade;`);

    this.addSql(`alter table "issue_contributors" drop constraint chk_cover_artist_requires_cover;`);

    this.addSql(`alter table "issue_contributors" add constraint chk_cover_artist_requires_cover check((role <> 'COVER_ARTIST'::contributor_role) OR (cover_uuid IS NOT NULL));`);
  }

}
