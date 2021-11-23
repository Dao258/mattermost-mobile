// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Relation} from '@nozbe/watermelondb';
import {children, field, immutableRelation} from '@nozbe/watermelondb/decorators';
import Model, {Associations} from '@nozbe/watermelondb/Model';

import {MM_TABLES} from '@constants/database';
import CategoryModel from '@typings/database/models/servers/category';

import type ChannelInfoModel from '@typings/database/models/servers/channel_info';
import type ChannelMembershipModel from '@typings/database/models/servers/channel_membership';
import type DraftModel from '@typings/database/models/servers/draft';
import type GroupsChannelModel from '@typings/database/models/servers/groups_channel';
import type MyChannelModel from '@typings/database/models/servers/my_channel';
import type MyChannelSettingsModel from '@typings/database/models/servers/my_channel_settings';
import type PostModel from '@typings/database/models/servers/post';
import type PostsInChannelModel from '@typings/database/models/servers/posts_in_channel';
import type TeamModel from '@typings/database/models/servers/team';
import type UserModel from '@typings/database/models/servers/user';

const {
    CATEGORY,
    CHANNEL,
    CHANNEL_INFO,
    CHANNEL_MEMBERSHIP,
    DRAFT,
    GROUPS_CHANNEL,
    MY_CHANNEL,
    MY_CHANNEL_SETTINGS,
    POSTS_IN_CHANNEL,
    POST,
    TEAM,
    USER,
} = MM_TABLES.SERVER;

/**
 * The Channel model represents a channel in the Mattermost app.
 */
export default class ChannelModel extends Model {
    /** table (name) : Channel */
    static table = CHANNEL;

    /** associations : Describes every relationship to this table. */
    static associations: Associations = {

        /** A CHANNEL can be associated with multiple CHANNEL_MEMBERSHIP (relationship is 1:N) */
        [CHANNEL_MEMBERSHIP]: {type: 'has_many', foreignKey: 'channel_id'},

        /** A CHANNEL can be associated with multiple DRAFT (relationship is 1:N) */
        [DRAFT]: {type: 'has_many', foreignKey: 'channel_id'},

        /** A CHANNEL can be associated with multiple GROUPS_CHANNEL  (relationship is 1:N) */
        [GROUPS_CHANNEL]: {type: 'has_many', foreignKey: 'channel_id'},

        /** A CHANNEL can be associated with multiple POSTS_IN_CHANNEL (relationship is 1:N) */
        [POSTS_IN_CHANNEL]: {type: 'has_many', foreignKey: 'channel_id'},

        /** A CHANNEL can contain multiple POST (relationship is 1:N) */
        [POST]: {type: 'has_many', foreignKey: 'channel_id'},

        /** A CHANNEL can be associated to one MY_CHANNEL (relationship is 1:1) */
        [MY_CHANNEL]: {type: 'has_many', foreignKey: 'id'},

        /** A TEAM can be associated to CHANNEL (relationship is 1:N) */
        [TEAM]: {type: 'belongs_to', key: 'team_id'},

        /** A USER can create multiple CHANNEL (relationship is 1:N) */
        [USER]: {type: 'belongs_to', key: 'creator_id'},

        /** A CATEGORY can be associated to CHANNEL (relationship is 1:N) */
        [CATEGORY]: {type: 'belongs_to', key: 'category_id'},
    };

    /** create_at : The creation date for this channel */
    @field('create_at') createAt!: number;

    /** creator_id : The user who created this channel */
    @field('creator_id') creatorId!: string;

    /** update_at : The timestamp to when this channel was last updated on the server */
    @field('update_at') updateAt!: number;

    /** delete_at : The deletion/archived date of this channel */
    @field('delete_at') deleteAt!: number;

    /** display_name : The channel display name (e.g. Town Square ) */
    @field('display_name') displayName!: string;

    /** is_group_constrained : If a channel is  restricted to certain groups, this boolean will be true and only
     * members of that group have access to this team. Hence indicating that the members of this channel are
     * managed by groups.
     */
    @field('is_group_constrained') isGroupConstrained!: boolean;

    /** name : The name of the channel (e.g town-square) */
    @field('name') name!: string;

    /** shared: determines if it is a shared channel with another organization */
    @field('shared') shared!: boolean;

    /** team_id : The team to which this channel belongs.  It can be empty for direct/group message. */
    @field('team_id') teamId!: string;

    /** category_id : The category to which this channel belongs. */
    @field('category_id') categoryId!: string;

    /** type : The type of the channel ( e.g. G: group messages, D: direct messages, P: private channel and O: public channel) */
    @field('type') type!: ChannelType;

    /** members : Users belonging to this channel */
    @children(CHANNEL_MEMBERSHIP) members!: ChannelMembershipModel[];

    /** drafts : All drafts for this channel */
    @children(DRAFT) drafts!: DraftModel[];

    /** groupsChannel : Every group contained in this channel */
    @children(GROUPS_CHANNEL) groupsChannel!: GroupsChannelModel[];

    /** posts : All posts made in that channel */
    @children(POST) posts!: PostModel[];

    /** postsInChannel : a section of the posts for that channel bounded by a range */
    @children(POSTS_IN_CHANNEL) postsInChannel!: PostsInChannelModel[];

    /** team : The TEAM to which this CHANNEL belongs */
    @immutableRelation(TEAM, 'team_id') team!: Relation<TeamModel>;

    /** team : The CATEGORY to which this CHANNEL belongs */
    @immutableRelation(CATEGORY, 'category_id') category!: Relation<CategoryModel>;

    /** creator : The USER who created this CHANNEL*/
    @immutableRelation(USER, 'creator_id') creator!: Relation<UserModel>;

    /** info : Query returning extra information about this channel from CHANNEL_INFO table */
    // @lazy info = this.collections.get(CHANNEL_INFO).query(Q.on(CHANNEL, 'id', this.id)) as Query<ChannelInfoModel>;
    @immutableRelation(CHANNEL_INFO, 'id') info!: Relation<ChannelInfoModel>;

    /** membership : Query returning the membership data for the current user if it belongs to this channel */
    @immutableRelation(MY_CHANNEL, 'id') membership!: Relation<MyChannelModel>;

    /** settings: User specific settings/preferences for this channel */
    @immutableRelation(MY_CHANNEL_SETTINGS, 'id') settings!: Relation<MyChannelSettingsModel>;

    toApi = (): Omit<Channel, 'category_id'> => {
        return {
            id: this.id,
            create_at: this.createAt,
            update_at: this.updateAt,
            delete_at: this.deleteAt,
            team_id: this.teamId,
            type: this.type,
            display_name: this.displayName,
            name: this.name,
            header: '',
            purpose: '',
            last_post_at: 0,
            total_msg_count: 0,
            extra_update_at: 0,
            creator_id: this.creatorId,
            scheme_id: null,
            group_constrained: null,
            shared: this.shared,
        };
    };
}
