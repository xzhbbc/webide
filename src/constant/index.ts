export const initHtmlTmp = (inner: string) => `<template>${inner}</template>`
export const warpJs = (inner: string) => `<script>
${inner}</script>`
export const warpCss = (inner: string) => `<style lang="scss">
${inner}
</style>`
export const initJsTmp = `export default {
    data() {
        return {

        }
    },
    methods: {

    }
}`
