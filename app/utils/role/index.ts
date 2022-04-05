// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import type RoleModel from '@typings/database/models/servers/role';

export function hasPermission(roles: RoleModel[] | Role[], permission: string, defaultValue: boolean) {
    const permissions = new Set<string>();
    for (const role of roles) {
        role.permissions.forEach(permissions.add, permissions);
    }

    const exists = permissions.has(permission);
    return defaultValue === true || exists;
}
