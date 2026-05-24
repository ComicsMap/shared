import { Migration } from '@mikro-orm/migrations';

export class Migration20260524060626 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "issues" add column "verified_at" timestamptz null;`);

    this.addSql(`alter table "issue_contributors" drop constraint chk_cover_artist_requires_cover;`);

    this.addSql(`alter table "issue_contributors" add constraint chk_cover_artist_requires_cover check(role != 'COVER_ARTIST' OR cover_uuid IS NOT NULL);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "issue_contributors" drop constraint chk_cover_artist_requires_cover;`);

    this.addSql(`alter table "issue_contributors" add constraint chk_cover_artist_requires_cover check((role <> 'COVER_ARTIST'::contributor_role) OR (cover_uuid IS NOT NULL));`);

    this.addSql(`alter table "issues" drop column "verified_at";`);
  }

}
