from django.db.models import Max
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from bs4 import BeautifulSoup
from datetime import datetime
import time
import json

from ..models import Product, Review


def scrapping():
    # ---------------------------- 초기 설정 ----------------------------
    global prd_id, prd_name, recent_review_num, prd_img_src

    # mysql에 datetime으로 저장하기 위한 date_format
    date_format = "%Y-%m-%d"

    # 옵션 설정
    options = webdriver.ChromeOptions()
    options.add_argument('headless')    # 백그라운드에서 실행 옵션
    options.add_argument("--disable-gpu")    # gpu 가속을 하지 않는 옵션
    options.add_argument("--disable-images")     # 이미지 로딩은 하지 않는 옵션

    # chrome 연결
    driver = webdriver.Chrome(options=options)

    url = 'https://web.ttobakcare.com/goods/catalog?code=00010010'  # 또박케어 드시모네 상품 페이지
    driver.get(url)

    # 모든 요소에 대해 5초의 대기시간을 설정한다. 만약 5초안에 작업이 완료되면 5초를 기다리지 않고 다음 작업을 설정한다.
    driver.implicitly_wait(5)

    # -------------------------------------------------------------------------------------------------------

    # ----------- 함수 ------------------------------------------------

    # 특정 prd_id의 최신 review_num를 조회
    def recent_review(prd_id):
        review_num = Review.objects.filter(prd_id=prd_id).aggregate(max_review_num=Max('review_num'))
        recent_review_num = review_num['max_review_num']
        return recent_review_num

    # 특정 상품이 product 테이블에 있는지 검사
    def find_product(prd_id):
        try:
            product = Product.objects.get(id=prd_id)
            return product
        except Product.DoesNotExist:
            return None

    # product 테이블에 새로운 상품 insert
    def insert_product(prd_id, prd_name, prd_price, prd_img_src):
        product = Product(
            id=prd_id,
            name=prd_name,
            price=prd_price,
            src=prd_img_src
        )
        product.save()

    # 리뷰데이터를 models를 사용하여 데이터베이스에 저장
    def insert_reviews(prd_id, review_num, title, user_name, date, count, content):
        product_id = find_product(prd_id)
        review = Review(
            prd=product_id,
            review_num=review_num,
            title=title,
            user_name=user_name,
            date=date,
            count=count,
            content=content
        )
        review.save()

    # --------------------------------------------------------------------

    # ------------------------ 프로그램 메인 -------------------------------------------
    # product의 총 개수를 구하기 위한 list 찾기
    prd_length = len(driver.find_elements(By.CSS_SELECTOR, 'div.category-list > ul > li '))

    # list의 갯수 만큼 for문 반복
    for i in range(0, prd_length):

        # for prd in prd_list를 해봤지만 동적으로 크롤링 할 시 항상 같은 코드가 같은건 아닌거 같다! 그러므로 페이지가 돌아올때마다 list를 다시 찾고
        prd_list = driver.find_elements(By.CSS_SELECTOR, f'div.category-list > ul > li')

        try:
            # 나중 프론트를 구성할 때 사용하기 위함
            prd_img_src = prd_list[i].find_element(By.TAG_NAME, 'img').get_attribute('src')
            # 이어서 다른 상품 검색
            prd_list[i].click()
        except:
            # 화면에 클릭 요소가 나타나지 않아서 오류가 생기면 pagedown으로 요소가 보이게끔 한 후 click을 한다.
            action = ActionChains(driver)
            action.send_keys(Keys.PAGE_DOWN).perform()
            prd_list[i].click()

        # ----------- 상품의 리뷰 크롤링 코드----------------------

        # 리뷰 버튼 클릭
        review_btn = driver.find_element(By.CLASS_NAME, 'goodsInfo-btn-review')
        review_btn.click()

        # 최신 리뷰를 다 업데이트하고 이중 반복문을 탈출하기 위한 변수
        escape = False
        # 상품을 처음 불러 왔을 때 최신리뷰와 상품의 정보를 불러오기 위한 변수
        count_num = 0
        while (True):
            count_num += 1
            # 여러가지 방법을 써봤지만 sleep을 이용하지 않으면 parsing이 제대로 되지 않아서 parsing에 문제가 안생기는 최소 sleep을 걸어 두었습니다.

            time.sleep(1)

            page_source = driver.page_source

            # page_source을 BeautifulSoup 객체로 파싱
            soup = BeautifulSoup(page_source, 'html.parser')

            # 상품 페이지에 들어가서 상품을 처음 스크래핑할 때만 해당 정보를 가져온다.
            if count_num == 1:
                # id가 'items'인 div를 찾는다
                prd_info = soup.find('div', {'id': 'items'})

                # JSON 데이터를 파싱
                items_data = json.loads(prd_info.text)

                # 파싱한 데이터에서 product의 id, name을 추출
                prd = items_data['items'][0]
                prd_id = int(prd['item_id'])
                prd_name = prd['item_name']
                prd_price = prd['price']

                # product테이블에서 prd_id를 검색하고 반환값이 없으면 해당 상품이 등록이 안되어 있는 것이므로 product 데이터베이스에 insert
                if not find_product(prd_id):
                    insert_product(prd_id, prd_name, prd_price, prd_img_src)

                # 해당 id로 최신 review_num 가지고 옴
                recent_review_num = recent_review(prd_id)

            # 파싱된 데이터에서 상품 리뷰 list를 가져옴
            board_info = soup.find('ul', {'class': 'board-list'}).find_all('li')

            # 리스트의 길이 확인
            board_len = len(board_info)

            # 리뷰가 없는 경우는 바로 break (리스트의 맨 처음에는 header가 들어있고 마지막줄에는 '리뷰가 없습니다' 가 들어있으므로 리뷰가 없을 때 list의 길이는 2)
            if board_len < 3:
                print("리뷰가 없습니다. 다음 상품으로 넘어갑니다.")
                break

            # 현재 가장 리뷰페이지 가장 처음에 있는 리뷰의 번호를 가지고옴
            current_review_num = int(board_info[1].find('p', {'class': 'board-list-index'}).text)

            # 데이터베이스 가장 최근 리뷰번호와 페이지 리뷰의 번호가 같으면 최신 리뷰가 없는 것이므로 break(다음 product로 넘어감)
            if recent_review_num == current_review_num:
                print("최신 리뷰가 없습니다. 다음 상품으로 넘어갑니다.")
                break

            # 0번째는 header, 마지막 index는 '리뷰가 없습니다' 이므로 1번째부터 last_index-1까지 for문 반복
            for i in range(1, len(board_info) - 1):
                review_info = board_info[i]
                # 각 필요한 정보들만 찾아서 변수에 저장 + 형 변환
                review_num = int(review_info.find('p', {'class': 'board-list-index'}).text)

                # 크롤링을 하다가 현재 리뷰 번호가 데이터베이스의 최신 리뷰번호가 같아지면 더 이상 크롤링 할 필요가 없기 때문에 다음 상품으로 넘어간다.
                if recent_review_num == review_num:
                    print("최신 리뷰를 모두 업데이트 했습니다. 다음 상품으로 넘어갑니다.")
                    # escape를 true로 변경하고 break를 하자마자 if문으로 while문 탈출
                    escape = True
                    break

                title = review_info.find('p', {'class': 'board-list-title'}).text
                user_name = review_info.find('p', {'class': 'board-list-writer'}).text
                date = datetime.strptime(review_info.find('p', {'class': 'board-list-date'}).text, date_format)
                count = int(review_info.find('p', {'class': 'board-list-count'}).text)
                content = review_info.find('div', {'class': 'board-list-content'}).text
                # \n은 불필요한거 같아서 띄어쓰기로 대체
                content = content.replace('\n', ' ')
                # database에 insert할 때 작은 따옴표 때문에 오류가 생기므로 작은 따옴표를 띄어쓰기로 대체
                content = content.replace('\'', ' ')
                # title에 가끔 작은 따옴표를 사용하시는 분이 있어서 작은 따옴표가 있으면 삭제
                title = title.replace('\'', '')

                try:
                    # 크롤링한 데이터를 데이터베이스에 저장
                    insert_reviews(prd_id, review_num, user_name, title, date, count, content)
                except Exception as e:
                    # 상품을 데이터 베이스에 저장을 하다가 오류가 생겼을 때 해당 상품의 이름, 리뷰 번호, 내용을 출력 (오류가 난 리뷰의 위치를 찾기 위함)
                    print(f"상품 = {prd_name},  리뷰 번호 = {review_num}, 내용 = {content}")
                    # 오류 내용을 출력하여 어떤 오류가 났는지 확인함
                    print("오류 : ", e)
                    break

            # excape가 true면 모든 최신 리뷰가 업데이트 된 것이므로 break
            if escape: break

            # 리뷰가 10개가 안되는 경우(즉, 페이지가 하나 밖에 없을 경우 break)
            if board_len < 12:
                print('끝')
                break

            try:
                # selenium으로 버튼을 찾아 클릭하게 되면 화면에 버튼이 나와야지만 클릭을 할 수 있기 때문에 JavaScript를 사용하여 해당 버튼을 찾고 클릭함
                driver.execute_script("document.querySelector('button.next').click();")
            except:
                print('끝')
                break

        # -------------------------------------------------------------------------
        try:
            # 리뷰를 크롤링하면서 너무 많은 페이지를 이동했기 때문에 뒤로 가기는 의미가 없고, 페이지 상단 메뉴 리스트에서 드시모네를 선택하는게 빠를 듯 하여 해당 list를 검색하여 클릭
            driver.execute_script("document.querySelector('div.pc-header-menu > ul > li:nth-child(2) > a').click();")
        except:
            print("실패")

    # conn.close()
    # -----------------------------------------------------------------------------------------------