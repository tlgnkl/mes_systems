from pydantic import BaseModel, Field
from typing import Optional

class ItemCreate(BaseModel):
    """
    Схема для СОЗДАНИЯ нового предмета.
    Используется когда клиент отправляет POST запрос.
    """
    
    # Обязательное поле, минимум 1 символ, максимум 100
    title: str = Field(
        ...,  # ... означает что поле обязательное
        min_length=1, 
        max_length=100,
        example="Новый предмет"  # Пример для документации
    )
    
    # Необязательное поле
    description: Optional[str] = Field(
        None,  # Значение по умолчанию
        max_length=500,
        example="Описание предмета"
    )
    
    # Необязательное поле, должно быть >= 0 если указано
    price: Optional[int] = Field(
        None,
        ge=0,  # greater or equal - больше или равно 0
        example=1000
    )

class ItemUpdate(BaseModel):
    """
    Схема для ОБНОВЛЕНИЯ предмета.
    Все поля необязательные - можно обновить только часть данных.
    """
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    price: Optional[int] = Field(None, ge=0)

class ItemResponse(BaseModel):
    """
    Схема для ОТВЕТА клиенту.
    Включает ID, который генерируется базой данных.
    """
    id: int
    title: str
    description: Optional[str]
    price: Optional[int]
    
    class Config:
        # Включаем режим ORM для работы с SQLAlchemy объектами
        orm_mode = True
        # Это позволяет Pydantic читать данные из ORM объектов,
        # а не только из словарей
