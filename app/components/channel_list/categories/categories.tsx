// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FlatList, StyleSheet} from 'react-native';

import ThreadsButton from '../threads';

import CategoryBody from './body';
import CategoryHeader from './header';

import type {CategoryModel} from '@app/database/models/server';

type Props = {
    categories: CategoryModel[];
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
});

const renderCategory = (data: {item: CategoryModel}) => {
    // console.log('--- Category Channels', data.item.channels);

    return (
        <>
            <CategoryHeader heading={data.item.displayName}/>
            <CategoryBody category={data.item}/>
        </>
    );
};

const Categories = (props: Props) => {
    return (
        <FlatList
            data={props.categories}
            renderItem={renderCategory}
            ListHeaderComponent={ThreadsButton}
            style={styles.flex}
        />
    );
};

export default Categories;
