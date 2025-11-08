from fastapi import FastAPI, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db, engine
from models import Base
from schemas import ItemCreate, ItemUpdate, ItemResponse
import crud

# Создаем таблицы
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="My CRUD API",
    description="Простое CRUD приложение на FastAPI",
    version="1.0.0"
)

@app.get("/")
def read_root():
    """
    Корневой endpoint для проверки работы API.
    """
    return {"message": "Welcome to FastAPI CRUD API"}

# CREATE - Создать элемент
@app.post("/items/", 
          response_model=ItemResponse, 
          status_code=status.HTTP_201_CREATED,
          summary="Создать предмет",
          description="Создает новый предмет в базе данных")
def create_item(
    item: ItemCreate,  # 📝 Данные из тела запроса (валидируются схемой ItemCreate)
    db: Session = Depends(get_db)  # 🗄️ Сессия БД (автоматически создается и закрывается)
):
    """
    Создать новый предмет в системе.
    
    - **title**: Название предмета (обязательное поле, 1-100 символов)
    - **description**: Описание предмета (необязательное)
    - **price**: Цена предмета (необязательное, должно быть >= 0)
    """
    # Просто передаем данные в CRUD слой
    return crud.create_item(db=db, item=item)

# READ - Получить все элементы
@app.get("/items/", 
         response_model=List[ItemResponse],
         summary="Получить все предметы",
         description="Возвращает список предметов с пагинацией и фильтрацией")
def read_items(
    skip: int = Query(0, ge=0, description="Сколько записей пропустить"),  # 🎯 Параметр запроса с валидацией
    limit: int = Query(100, ge=1, le=1000, description="Лимит записей"),   # 🎯 Максимум 1000 записей
    title: Optional[str] = Query(None, description="Фильтр по названию"),  # 🎯 Необязательный фильтр
    db: Session = Depends(get_db)  # 🗄️ Сессия БД
):
    """
    Получить список предметов с поддержкой пагинации.
    
    - **skip**: Сколько записей пропустить (для пагинации)
    - **limit**: Максимальное количество записей (1-1000)
    - **title**: Фильтр по названию (необязательный)
    """
    # В реальном проекте можно добавить фильтрацию в CRUD функцию
    items = crud.get_items(db, skip=skip, limit=limit)
    
    # Если передан фильтр по названию, фильтруем результаты
    if title:
        items = [item for item in items if title.lower() in item.title.lower()]
    
    return items

# READ - Получить один элемент
@app.get("/items/{item_id}", 
         response_model=ItemResponse,
         summary="Получить предмет по ID",
         description="Возвращает один предмет по его идентификатору")
def read_item(
    item_id: int,  # 🎯 Параметр пути из URL
    db: Session = Depends(get_db)  # 🗄️ Сессия БД
):
    """
    Получить предмет по его уникальному идентификатору.
    
    - **item_id**: ID предмета (целое число > 0)
    """
    # Получаем предмет через CRUD слой
    db_item = crud.get_item(db, item_id=item_id)
    
    # Если предмет не найден, возвращаем 404 ошибку
    if db_item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Item not found"  # 📝 Сообщение об ошибке
        )
    
    return db_item

# UPDATE - Обновить элемент
@app.put("/items/{item_id}", 
         response_model=ItemResponse,
         summary="Обновить предмет",
         description="Обновляет данные предмета по ID")
def update_item(
    item_id: int,  # 🎯 ID предмета из URL пути
    item: ItemUpdate,  # 📝 Данные для обновления (только измененные поля)
    db: Session = Depends(get_db)  # 🗄️ Сессия БД
):
    """
    Обновить данные существующего предмета.
    
    - **item_id**: ID обновляемого предмета
    - Можно передать любое количество полей для обновления
    - Только переданные поля будут обновлены
    """
    # Вызываем CRUD операцию обновления
    db_item = crud.update_item(db, item_id=item_id, item=item)
    
    # Если предмет не найден, возвращаем 404
    if db_item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Item not found"
        )
    
    return db_item

# DELETE - Удалить элемент
@app.delete("/items/{item_id}",
            summary="Удалить предмет",
            description="Удаляет предмет по ID из базы данных")
def delete_item(
    item_id: int,  # 🎯 ID предмета из URL пути
    db: Session = Depends(get_db)  # 🗄️ Сессия БД
):
    """
    Удалить предмет из системы по его ID.
    
    - **item_id**: ID удаляемого предмета
    """
    # Вызываем CRUD операцию удаления
    success = crud.delete_item(db, item_id=item_id)
    
    # Если предмет не найден, возвращаем 404
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Item not found"
        )
    
    return {"message": "Item deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
