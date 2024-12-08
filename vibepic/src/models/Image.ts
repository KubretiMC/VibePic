export interface Image {
    id: string;
    createdAt: Date;
    description: string;
    imagePath: string;
    groupName?: string;
    groupId?: string;
    likes: number;
    uploaderName: string;
}