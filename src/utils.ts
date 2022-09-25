//TODO: handle numbers over 999
export const numberToMoney = (n: number) => '$ ' + n

export const fetcher = (url: string) => fetch(url).then(res => res.json())