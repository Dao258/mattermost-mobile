// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import {switchMap} from 'rxjs/operators';

import {observeCurrentChannelId, observeCurrentTeamId} from '@queries/servers/system';
import {observeUnreadsAndMentionsInTeam} from '@queries/servers/thread';

import Threads from './threads';

import type {WithDatabaseArgs} from '@typings/database/database';

const enhanced = withObservables([], ({database}: WithDatabaseArgs) => {
    const currentTeamId = observeCurrentTeamId(database);

    return {
        currentChannelId: observeCurrentChannelId(database),
        unreadsAndMentions: currentTeamId.pipe(
            switchMap(
                ([teamId]) => observeUnreadsAndMentionsInTeam(database, teamId),
            ),
        ),
    };
});

export default withDatabase(enhanced(Threads));
