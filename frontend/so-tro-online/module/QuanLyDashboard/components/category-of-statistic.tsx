"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguageStore } from "@/zustand/language-tranlator";
import { TrendingDown, TrendingUp } from "lucide-react";


export default function CategoryOfStatistic({categoryOfStatistic}: {categoryOfStatistic: CategoryOfStatistic}) {

    const {language} = useLanguageStore();

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                    {language === 'vi' ? categoryOfStatistic.category_vietnam_title : categoryOfStatistic.category_title}
                </CardTitle>
                {categoryOfStatistic.icon}
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold text-gray-900">{categoryOfStatistic.value}</div>
                    <p className={`text-sm ${
                        categoryOfStatistic.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    } flex items-center mt-1`}>
                        {categoryOfStatistic.changeType === 'positive' ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                        ) : <TrendingDown className="h-3 w-3 mr-1"/>}
                        {language === 'vi' ? `${categoryOfStatistic.changeValue} so với 1 tháng trước` : `${categoryOfStatistic.category_title} from last month`}
                </p>
            </CardContent>
        </Card>
    )
}