export interface MessageRecord {
  SNo: number;
  Name: string;
  PhoneNumber: string;
  MessageStatus: 'Delivered' | 'Failed' | 'Pending';
  Date: string;
}

export const messageData: MessageRecord[] = [
  { SNo: 1, Name: 'John Doe', PhoneNumber: '123-456-7890', MessageStatus: 'Delivered', Date: '2024-11-01' },
  { SNo: 2, Name: 'Jane Smith', PhoneNumber: '987-654-3210', MessageStatus: 'Failed', Date: '2024-11-02' },
  { SNo: 3, Name: 'Sam Wilson', PhoneNumber: '555-123-4567', MessageStatus: 'Pending', Date: '2024-11-03' },
  { SNo: 4, Name: 'Emma Brown', PhoneNumber: '444-789-0123', MessageStatus: 'Delivered', Date: '2024-11-04' },
  { SNo: 5, Name: 'Liam Johnson', PhoneNumber: '333-567-8901', MessageStatus: 'Failed', Date: '2024-11-05' },
  { SNo: 6, Name: 'Sophia Lee', PhoneNumber: '222-345-6789', MessageStatus: 'Delivered', Date: '2024-11-06' },
  { SNo: 7, Name: 'James King', PhoneNumber: '111-234-5678', MessageStatus: 'Pending', Date: '2024-11-07' },
  { SNo: 8, Name: 'Isabella Harris', PhoneNumber: '999-876-5432', MessageStatus: 'Failed', Date: '2024-11-08' },
  { SNo: 9, Name: 'Mason Clark', PhoneNumber: '888-765-4321', MessageStatus: 'Delivered', Date: '2024-11-09' },
  { SNo: 10, Name: 'Amelia Scott', PhoneNumber: '777-654-3210', MessageStatus: 'Pending', Date: '2024-11-10' },
  { SNo: 11, Name: 'Ethan Allen', PhoneNumber: '666-543-2109', MessageStatus: 'Delivered', Date: '2024-11-11' },
  { SNo: 12, Name: 'Avery Turner', PhoneNumber: '555-432-1098', MessageStatus: 'Failed', Date: '2024-11-12' },
  { SNo: 13, Name: 'Lily Adams', PhoneNumber: '444-321-0987', MessageStatus: 'Pending', Date: '2024-11-13' },
  { SNo: 14, Name: 'David Lewis', PhoneNumber: '333-210-9876', MessageStatus: 'Delivered', Date: '2024-11-14' },
  { SNo: 15, Name: 'Zoe Walker', PhoneNumber: '222-109-8765', MessageStatus: 'Failed', Date: '2024-11-15' },
  { SNo: 16, Name: 'Jackson Moore', PhoneNumber: '111-098-7654', MessageStatus: 'Delivered', Date: '2024-11-16' },
  { SNo: 17, Name: 'Charlotte Young', PhoneNumber: '999-987-6543', MessageStatus: 'Pending', Date: '2024-11-17' },
  { SNo: 18, Name: 'Landon King', PhoneNumber: '888-876-5432', MessageStatus: 'Failed', Date: '2024-11-18' },
  { SNo: 19, Name: 'Harper Green', PhoneNumber: '777-765-4321', MessageStatus: 'Delivered', Date: '2024-11-19' },
  { SNo: 20, Name: 'Sebastian Moore', PhoneNumber: '666-654-3210', MessageStatus: 'Pending', Date: '2024-11-20' },
  { SNo: 21, Name: 'Owen Lee', PhoneNumber: '555-543-2109', MessageStatus: 'Delivered', Date: '2024-11-21' },
  { SNo: 22, Name: 'Chloe Davis', PhoneNumber: '444-432-1098', MessageStatus: 'Failed', Date: '2024-11-22' },
  { SNo: 23, Name: 'Daniel Harris', PhoneNumber: '333-321-0987', MessageStatus: 'Pending', Date: '2024-11-23' },
  { SNo: 24, Name: 'Aiden Clark', PhoneNumber: '222-210-9876', MessageStatus: 'Delivered', Date: '2024-11-24' },
  { SNo: 25, Name: 'Luna Perez', PhoneNumber: '111-109-8765', MessageStatus: 'Failed', Date: '2024-11-25' },
  { SNo: 26, Name: 'Mia Ramirez', PhoneNumber: '999-876-5432', MessageStatus: 'Delivered', Date: '2024-11-26' },
  { SNo: 27, Name: 'Levi Wilson', PhoneNumber: '888-765-4321', MessageStatus: 'Pending', Date: '2024-11-27' },
  { SNo: 28, Name: 'Eva Gonzalez', PhoneNumber: '777-654-3210', MessageStatus: 'Failed', Date: '2024-11-28' },
  { SNo: 29, Name: 'Benjamin Taylor', PhoneNumber: '666-543-2109', MessageStatus: 'Delivered', Date: '2024-11-29' },
  { SNo: 30, Name: 'Maya Anderson', PhoneNumber: '555-432-1098', MessageStatus: 'Pending', Date: '2024-11-30' },
  { SNo: 31, Name: 'Caleb Jackson', PhoneNumber: '444-321-0987', MessageStatus: 'Failed', Date: '2024-12-01' },
  { SNo: 32, Name: 'Ellie Mitchell', PhoneNumber: '333-210-9876', MessageStatus: 'Delivered', Date: '2024-12-02' },
  { SNo: 33, Name: 'Luke Robinson', PhoneNumber: '222-109-8765', MessageStatus: 'Pending', Date: '2024-12-03' },
  { SNo: 34, Name: 'Grace Walker', PhoneNumber: '111-098-7654', MessageStatus: 'Failed', Date: '2024-12-04' },
  { SNo: 35, Name: 'Henry Lee', PhoneNumber: '999-987-6543', MessageStatus: 'Delivered', Date: '2024-12-05' },
  { SNo: 36, Name: 'Madison King', PhoneNumber: '888-876-5432', MessageStatus: 'Pending', Date: '2024-12-06' },
  { SNo: 37, Name: 'Oscar Clark', PhoneNumber: '777-765-4321', MessageStatus: 'Failed', Date: '2024-12-07' },
  { SNo: 38, Name: 'Victoria Allen', PhoneNumber: '666-654-3210', MessageStatus: 'Delivered', Date: '2024-12-08' },
  { SNo: 39, Name: 'Carter Young', PhoneNumber: '555-543-2109', MessageStatus: 'Pending', Date: '2024-12-09' },
  { SNo: 40, Name: 'Scarlett Perez', PhoneNumber: '444-432-1098', MessageStatus: 'Delivered', Date: '2024-12-10' },
  { SNo: 41, Name: 'Nathan Scott', PhoneNumber: '333-321-0987', MessageStatus: 'Failed', Date: '2024-12-11' },
  { SNo: 42, Name: 'Sophie Turner', PhoneNumber: '222-210-9876', MessageStatus: 'Delivered', Date: '2024-12-12' },
  { SNo: 43, Name: 'Alexander Harris', PhoneNumber: '111-109-8765', MessageStatus: 'Pending', Date: '2024-12-13' },
  { SNo: 44, Name: 'Leah Moore', PhoneNumber: '999-876-5432', MessageStatus: 'Failed', Date: '2024-12-14' },
  { SNo: 45, Name: 'William Green', PhoneNumber: '888-765-4321', MessageStatus: 'Delivered', Date: '2024-12-15' },
  { SNo: 46, Name: 'Lucas Adams', PhoneNumber: '777-654-3210', MessageStatus: 'Pending', Date: '2024-12-16' },
  { SNo: 47, Name: 'Lila Roberts', PhoneNumber: '666-543-2109', MessageStatus: 'Failed', Date: '2024-12-17' },
  { SNo: 48, Name: 'Oliver Johnson', PhoneNumber: '555-432-1098', MessageStatus: 'Delivered', Date: '2024-12-18' },
  { SNo: 49, Name: 'Harper Davis', PhoneNumber: '444-321-0987', MessageStatus: 'Pending', Date: '2024-12-19' },
  { SNo: 50, Name: 'Jack Taylor', PhoneNumber: '333-210-9876', MessageStatus: 'Failed', Date: '2024-12-20' }
];

