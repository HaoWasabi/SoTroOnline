
interface CategoryOfStatistic {
    category_title: string,
    category_vietnam_title: string,
    value: number,
    short_description: string | null,
    icon: React.ReactNode,
    changeType: 'positive' | 'negative',
    changeValue: number
}