export default function catchAsync(callback: any){
    return (req: any, res: any) => callback(req, res).catch((error: Error) => 
        res.status(500).json({ message: error.message })
    )
}