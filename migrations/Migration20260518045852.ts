import { Migration } from '@mikro-orm/migrations';

export class Migration20260518045852 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create type "user_role" as enum ('USER', 'ADMIN', 'OWNER');`);
    this.addSql(`create type "publisher" as enum ('MARVEL', 'DC');`);
    this.addSql(`create type "contributor_role" as enum ('WRITER', 'ARTIST', 'COVER_ARTIST');`);
    this.addSql(`create table "users" ("uuid" uuid not null default gen_random_uuid(), "username" varchar(64) not null, "display_name" varchar(64) null, "email" varchar(320) not null, "password" varchar(255) null, "google_id" varchar(64) null, "avatar_url" varchar(2048) null, "role" "user_role" not null default 'USER', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "users_pkey" primary key ("uuid"));`);
    this.addSql(`alter table "users" add constraint "users_username_unique" unique ("username");`);
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);
    this.addSql(`alter table "users" add constraint "users_google_id_unique" unique ("google_id");`);
    this.addSql(`create index "idx_users_google_id" on "users" ("google_id");`);
    this.addSql(`create index "idx_users_email" on "users" ("email");`);
    this.addSql(`create index "idx_users_display_name" on "users" ("display_name");`);
    this.addSql(`create index "idx_users_username" on "users" ("username");`);

    this.addSql(`create table "series" ("uuid" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default now(), "created_by" uuid null, "updated_at" timestamptz not null default now(), "updated_by" uuid null, "deleted_at" timestamptz null, "deleted_by" uuid null, "title" varchar(255) not null, "start_year" smallint null, constraint "series_pkey" primary key ("uuid"));`);

    this.addSql(`create table "people" ("uuid" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default now(), "created_by" uuid null, "updated_at" timestamptz not null default now(), "updated_by" uuid null, "deleted_at" timestamptz null, "deleted_by" uuid null, "first_name" varchar(32) null, "last_name" varchar(64) null, "pseudonym" varchar(32) null, constraint "people_pkey" primary key ("uuid"), constraint people_identity_check check (pseudonym IS NOT NULL OR (first_name IS NOT NULL AND last_name IS NOT NULL)));`);

    this.addSql(`create table "issues" ("uuid" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default now(), "created_by" uuid null, "updated_at" timestamptz not null default now(), "updated_by" uuid null, "deleted_at" timestamptz null, "deleted_by" uuid null, "title" varchar(255) not null, "synopsis" text null, "publisher" "publisher" not null, "series_uuid" uuid not null, "issue_number" numeric(5,1) null, "published_at" timestamptz not null, constraint "issues_pkey" primary key ("uuid"));`);
    this.addSql(`create index "idx_issues_published_at" on "issues" ("published_at");`);
    this.addSql(`create index "idx_issues_publisher" on "issues" ("publisher");`);

    this.addSql(`create table "reading_edges" ("from_uuid" uuid not null, "to_uuid" uuid not null, "created_at" timestamptz not null default now(), constraint "reading_edges_pkey" primary key ("from_uuid", "to_uuid"));`);

    this.addSql(`create table "issue_layouts" ("issue_uuid" uuid not null, "x" double precision not null, "y" double precision not null, "community_id" int not null, "component_id" int not null, "computed_at" timestamptz not null default now(), constraint "issue_layouts_pkey" primary key ("issue_uuid"));`);
    this.addSql(`create index "idx_issue_layouts_bbox" on "issue_layouts" using gist (point(x, y));`);
    this.addSql(`create index "idx_issue_layouts_community" on "issue_layouts" ("community_id");`);
    this.addSql(`create index "idx_issue_layouts_component" on "issue_layouts" ("component_id");`);

    this.addSql(`create table "covers" ("uuid" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default now(), "created_by" uuid null, "updated_at" timestamptz not null default now(), "updated_by" uuid null, "deleted_at" timestamptz null, "deleted_by" uuid null, "url" varchar(512) not null, "is_variant" boolean not null default false, "barcodes" varchar[] not null default '{}', constraint "covers_pkey" primary key ("uuid"));`);
    this.addSql(`create index "idx_covers_is_variant" on "covers" ("is_variant");`);

    this.addSql(`create table "issue_contributors" ("uuid" uuid not null default gen_random_uuid(), "issue_uuid" uuid not null, "person_uuid" uuid not null, "cover_uuid" uuid null, "role" "contributor_role" not null, constraint "issue_contributors_pkey" primary key ("uuid"), constraint chk_cover_requires_cover_artist_role check (cover_uuid IS NULL OR role = 'COVER_ARTIST'), constraint chk_cover_artist_requires_cover check (role != 'COVER_ARTIST' OR cover_uuid IS NOT NULL));`);
    this.addSql(`alter table "issue_contributors" add constraint "uq_issue_contributor" unique ("issue_uuid", "person_uuid", "role", "cover_uuid");`);

    this.addSql(`alter table "series" add constraint "series_created_by_foreign" foreign key ("created_by") references "users" ("uuid") on update cascade on delete set null;`);
    this.addSql(`alter table "series" add constraint "series_updated_by_foreign" foreign key ("updated_by") references "users" ("uuid") on update cascade on delete set null;`);
    this.addSql(`alter table "series" add constraint "series_deleted_by_foreign" foreign key ("deleted_by") references "users" ("uuid") on update cascade on delete set null;`);

    this.addSql(`alter table "people" add constraint "people_created_by_foreign" foreign key ("created_by") references "users" ("uuid") on update cascade on delete set null;`);
    this.addSql(`alter table "people" add constraint "people_updated_by_foreign" foreign key ("updated_by") references "users" ("uuid") on update cascade on delete set null;`);
    this.addSql(`alter table "people" add constraint "people_deleted_by_foreign" foreign key ("deleted_by") references "users" ("uuid") on update cascade on delete set null;`);

    this.addSql(`alter table "issues" add constraint "issues_created_by_foreign" foreign key ("created_by") references "users" ("uuid") on update cascade on delete set null;`);
    this.addSql(`alter table "issues" add constraint "issues_updated_by_foreign" foreign key ("updated_by") references "users" ("uuid") on update cascade on delete set null;`);
    this.addSql(`alter table "issues" add constraint "issues_deleted_by_foreign" foreign key ("deleted_by") references "users" ("uuid") on update cascade on delete set null;`);
    this.addSql(`alter table "issues" add constraint "issues_series_uuid_foreign" foreign key ("series_uuid") references "series" ("uuid") on update cascade on delete set null;`);

    this.addSql(`alter table "reading_edges" add constraint "reading_edges_from_uuid_foreign" foreign key ("from_uuid") references "issues" ("uuid") on update cascade on delete cascade;`);
    this.addSql(`alter table "reading_edges" add constraint "reading_edges_to_uuid_foreign" foreign key ("to_uuid") references "issues" ("uuid") on update cascade on delete cascade;`);

    this.addSql(`alter table "issue_layouts" add constraint "issue_layouts_issue_uuid_foreign" foreign key ("issue_uuid") references "issues" ("uuid") on update cascade on delete cascade;`);

    this.addSql(`alter table "covers" add constraint "covers_created_by_foreign" foreign key ("created_by") references "users" ("uuid") on update cascade on delete set null;`);
    this.addSql(`alter table "covers" add constraint "covers_updated_by_foreign" foreign key ("updated_by") references "users" ("uuid") on update cascade on delete set null;`);
    this.addSql(`alter table "covers" add constraint "covers_deleted_by_foreign" foreign key ("deleted_by") references "users" ("uuid") on update cascade on delete set null;`);

    this.addSql(`alter table "issue_contributors" add constraint "issue_contributors_issue_uuid_foreign" foreign key ("issue_uuid") references "issues" ("uuid") on update cascade on delete cascade;`);
    this.addSql(`alter table "issue_contributors" add constraint "issue_contributors_person_uuid_foreign" foreign key ("person_uuid") references "people" ("uuid") on update cascade on delete cascade;`);
    this.addSql(`alter table "issue_contributors" add constraint "issue_contributors_cover_uuid_foreign" foreign key ("cover_uuid") references "covers" ("uuid") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "series" drop constraint "series_created_by_foreign";`);

    this.addSql(`alter table "series" drop constraint "series_updated_by_foreign";`);

    this.addSql(`alter table "series" drop constraint "series_deleted_by_foreign";`);

    this.addSql(`alter table "people" drop constraint "people_created_by_foreign";`);

    this.addSql(`alter table "people" drop constraint "people_updated_by_foreign";`);

    this.addSql(`alter table "people" drop constraint "people_deleted_by_foreign";`);

    this.addSql(`alter table "issues" drop constraint "issues_created_by_foreign";`);

    this.addSql(`alter table "issues" drop constraint "issues_updated_by_foreign";`);

    this.addSql(`alter table "issues" drop constraint "issues_deleted_by_foreign";`);

    this.addSql(`alter table "covers" drop constraint "covers_created_by_foreign";`);

    this.addSql(`alter table "covers" drop constraint "covers_updated_by_foreign";`);

    this.addSql(`alter table "covers" drop constraint "covers_deleted_by_foreign";`);

    this.addSql(`alter table "issues" drop constraint "issues_series_uuid_foreign";`);

    this.addSql(`alter table "issue_contributors" drop constraint "issue_contributors_person_uuid_foreign";`);

    this.addSql(`alter table "reading_edges" drop constraint "reading_edges_from_uuid_foreign";`);

    this.addSql(`alter table "reading_edges" drop constraint "reading_edges_to_uuid_foreign";`);

    this.addSql(`alter table "issue_layouts" drop constraint "issue_layouts_issue_uuid_foreign";`);

    this.addSql(`alter table "issue_contributors" drop constraint "issue_contributors_issue_uuid_foreign";`);

    this.addSql(`alter table "issue_contributors" drop constraint "issue_contributors_cover_uuid_foreign";`);

    this.addSql(`drop table if exists "users" cascade;`);

    this.addSql(`drop table if exists "series" cascade;`);

    this.addSql(`drop table if exists "people" cascade;`);

    this.addSql(`drop table if exists "issues" cascade;`);

    this.addSql(`drop table if exists "reading_edges" cascade;`);

    this.addSql(`drop table if exists "issue_layouts" cascade;`);

    this.addSql(`drop table if exists "covers" cascade;`);

    this.addSql(`drop table if exists "issue_contributors" cascade;`);

    this.addSql(`drop type "user_role";`);
    this.addSql(`drop type "publisher";`);
    this.addSql(`drop type "contributor_role";`);
  }

}
