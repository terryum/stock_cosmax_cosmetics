// 한국투자증권 API 타입 정의

// 토큰 발급 응답
export interface KisTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  access_token_token_expired: string; // YYYY-MM-DD HH:mm:ss
  // 에러 응답 필드
  msg_cd?: string;
  msg1?: string;
}

// 토큰 캐시 정보
export interface CachedToken {
  accessToken: string;
  expiresAt: Date;
  issuedAt: Date;
}

// 공통 API 응답 헤더
export interface KisApiResponseHeader {
  tr_id: string;
  gt_uid: string;
}

// 현재가 조회 응답 (FHKST01010100)
export interface KisPriceResponse {
  rt_cd: string; // 성공: 0
  msg_cd: string;
  msg1: string;
  output: {
    iscd_stat_cls_code: string; // 종목 상태 구분 코드
    marg_rate: string; // 증거금 비율
    rprs_mrkt_kor_name: string; // 대표 시장 한글명
    new_hgpr_lwpr_cls_code: string; // 신고가/신저가 구분 코드
    bstp_kor_isnm: string; // 업종 한글명
    temp_stop_yn: string; // 임시 정지 여부
    oprc_rang_cont_yn: string; // 시가 범위 연장 여부
    clpr_rang_cont_yn: string; // 종가 범위 연장 여부
    crdt_able_yn: string; // 신용 가능 여부
    grmn_rate_cls_code: string; // 보증금 비율 구분 코드
    elw_pblc_yn: string; // ELW 발행 여부
    stck_prpr: string; // 주식 현재가
    prdy_vrss: string; // 전일 대비
    prdy_vrss_sign: string; // 전일 대비 부호 (1:상한,2:상승,3:보합,4:하한,5:하락)
    prdy_ctrt: string; // 전일 대비율
    acml_tr_pbmn: string; // 누적 거래 대금
    acml_vol: string; // 누적 거래량
    prdy_vrss_vol_rate: string; // 전일 대비 거래량 비율
    stck_oprc: string; // 주식 시가
    stck_hgpr: string; // 주식 고가
    stck_lwpr: string; // 주식 저가
    stck_mxpr: string; // 주식 상한가
    stck_llam: string; // 주식 하한가
    stck_sdpr: string; // 주식 기준가
    wghn_avrg_stck_prc: string; // 가중 평균 주식 가격
    hts_frgn_ehrt: string; // HTS 외국인 소진율
    frgn_ntby_qty: string; // 외국인 순매수 수량
    pgtr_ntby_qty: string; // 프로그램 순매수 수량
    pvt_scnd_dmrs_prc: string; // 피봇 2차 디저항 가격
    pvt_frst_dmrs_prc: string; // 피봇 1차 디저항 가격
    pvt_pont_val: string; // 피봇 포인트 값
    pvt_frst_dmsp_prc: string; // 피봇 1차 디지지 가격
    pvt_scnd_dmsp_prc: string; // 피봇 2차 디지지 가격
    dmrs_val: string; // 디저항 값
    dmsp_val: string; // 디지지 값
    cpfn: string; // 자본금
    rstc_wdth_prc: string; // 제한 폭 가격
    stck_fcam: string; // 주식 액면가
    stck_sspr: string; // 주식 대용가
    aspr_unit: string; // 호가 단위
    hts_deal_qty_unit_val: string; // HTS 매매 수량 단위 값
    lstn_stcn: string; // 상장 주수
    hts_avls: string; // HTS 시가총액
    per: string; // PER
    pbr: string; // PBR
    stac_month: string; // 결산 월
    vol_tnrt: string; // 거래량 회전율
    eps: string; // EPS
    bps: string; // BPS
    d250_hgpr: string; // 250일 최고가
    d250_hgpr_date: string; // 250일 최고가 일자
    d250_hgpr_vrss_prpr_rate: string; // 250일 최고가 대비 현재가 비율
    d250_lwpr: string; // 250일 최저가
    d250_lwpr_date: string; // 250일 최저가 일자
    d250_lwpr_vrss_prpr_rate: string; // 250일 최저가 대비 현재가 비율
    stck_dryy_hgpr: string; // 주식 연중 최고가
    dryy_hgpr_vrss_prpr_rate: string; // 연중 최고가 대비 현재가 비율
    dryy_hgpr_date: string; // 연중 최고가 일자
    stck_dryy_lwpr: string; // 주식 연중 최저가
    dryy_lwpr_vrss_prpr_rate: string; // 연중 최저가 대비 현재가 비율
    dryy_lwpr_date: string; // 연중 최저가 일자
    w52_hgpr: string; // 52주 최고가
    w52_hgpr_vrss_prpr_ctrt: string; // 52주 최고가 대비 현재가 대비
    w52_hgpr_date: string; // 52주 최고가 일자
    w52_lwpr: string; // 52주 최저가
    w52_lwpr_vrss_prpr_ctrt: string; // 52주 최저가 대비 현재가 대비
    w52_lwpr_date: string; // 52주 최저가 일자
    whol_loan_rmnd_rate: string; // 전체 융자 잔고 비율
    ssts_yn: string; // 공매도 가능 여부
    stck_shrn_iscd: string; // 주식 단축 종목코드
    fcam_cnnm: string; // 액면가 통화명
    cpfn_cnnm: string; // 자본금 통화명
    apprch_rate: string; // 접근도
    frgn_hldn_qty: string; // 외국인 보유 수량
    vi_cls_code: string; // VI 적용구분코드
    ovtm_vi_cls_code: string; // 시간외 VI 적용구분코드
    last_ssts_cntg_qty: string; // 최종 공매도 체결 수량
    invt_caful_yn: string; // 투자유의 여부
    mrkt_warn_cls_code: string; // 시장경고코드
    short_over_yn: string; // 단기과열여부
    sltr_yn: string; // 정리매매여부
  };
}

// 일별 시세 조회 응답 (FHKST01010400)
export interface KisDailyPriceResponse {
  rt_cd: string;
  msg_cd: string;
  msg1: string;
  output1: {
    prdy_vrss: string;
    prdy_vrss_sign: string;
    prdy_ctrt: string;
    stck_prdy_clpr: string;
    acml_vol: string;
    acml_tr_pbmn: string;
    hts_kor_isnm: string;
    stck_prpr: string;
    stck_shrn_iscd: string;
    prdy_vol: string;
    stck_mxpr: string;
    stck_llam: string;
    stck_oprc: string;
    stck_hgpr: string;
    stck_lwpr: string;
    stck_prdy_oprc: string;
    stck_prdy_hgpr: string;
    stck_prdy_lwpr: string;
    askp: string;
    bidp: string;
    prdy_vrss_vol: string;
    vol_tnrt: string;
    stck_fcam: string;
    lstn_stcn: string;
    cpfn: string;
    hts_avls: string;
    per: string;
    eps: string;
    pbr: string;
    itewhol_loan_rmnd_ratem: string;
  };
  output2: KisDailyPriceItem[];
}

export interface KisDailyPriceItem {
  stck_bsop_date: string; // 주식 영업 일자 (YYYYMMDD)
  stck_clpr: string; // 주식 종가
  stck_oprc: string; // 주식 시가
  stck_hgpr: string; // 주식 고가
  stck_lwpr: string; // 주식 저가
  acml_vol: string; // 누적 거래량
  acml_tr_pbmn: string; // 누적 거래대금
  flng_cls_code: string; // 락 구분 코드
  prtt_rate: string; // 분할 비율
  mod_yn: string; // 분할변경여부
  prdy_vrss_sign: string; // 전일 대비 부호
  prdy_vrss: string; // 전일 대비
  revl_issu_reas: string; // 재평가사유코드
}

// 지수 현재가 조회 응답 (FHPUP02100000)
export interface KisIndexPriceResponse {
  rt_cd: string;
  msg_cd: string;
  msg1: string;
  output: {
    bstp_nmix_prpr: string; // 업종 지수 현재가
    bstp_nmix_prdy_vrss: string; // 업종 지수 전일 대비
    prdy_vrss_sign: string; // 전일 대비 부호
    bstp_nmix_prdy_ctrt: string; // 업종 지수 전일 대비율
    acml_vol: string; // 누적 거래량
    acml_tr_pbmn: string; // 누적 거래대금
    bstp_nmix_oprc: string; // 업종 지수 시가
    bstp_nmix_hgpr: string; // 업종 지수 고가
    bstp_nmix_lwpr: string; // 업종 지수 저가
    ascn_issu_cnt: string; // 상승 종목 수
    down_issu_cnt: string; // 하락 종목 수
    stnr_issu_cnt: string; // 보합 종목 수
    uplm_issu_cnt: string; // 상한 종목 수
    lslm_issu_cnt: string; // 하한 종목 수
    dryy_bstp_nmix_hgpr: string; // 연중 업종 지수 최고가
    dryy_hgpr_date: string; // 연중 최고가 일자
    dryy_bstp_nmix_lwpr: string; // 연중 업종 지수 최저가
    dryy_lwpr_date: string; // 연중 최저가 일자
  };
}

// 지수 일별 시세 조회 응답 (FHPUP02100100)
export interface KisIndexDailyPriceResponse {
  rt_cd: string;
  msg_cd: string;
  msg1: string;
  output1: {
    bstp_nmix_prpr: string;
    bstp_nmix_prdy_vrss: string;
    prdy_vrss_sign: string;
    bstp_nmix_prdy_ctrt: string;
    bstp_nmix_oprc: string;
    bstp_nmix_hgpr: string;
    bstp_nmix_lwpr: string;
  };
  output2: KisIndexDailyPriceItem[];
}

export interface KisIndexDailyPriceItem {
  stck_bsop_date: string; // 영업 일자
  bstp_nmix_prpr: string; // 업종 지수 현재가
  bstp_nmix_oprc: string; // 업종 지수 시가
  bstp_nmix_hgpr: string; // 업종 지수 고가
  bstp_nmix_lwpr: string; // 업종 지수 저가
  acml_vol: string; // 누적 거래량
  acml_tr_pbmn: string; // 누적 거래대금
  mod_yn: string; // 변경 여부
}

// 가공된 주가 데이터
export interface ProcessedStockPrice {
  code: string;
  name: string;
  currentPrice: number;
  changePrice: number;
  changeRate: number;
  changeSign: 'up' | 'down' | 'unchanged';
  volume: number;
  tradeAmount: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  marketCap?: number;
  per?: number;
  pbr?: number;
  high52w?: number;
  low52w?: number;
  timestamp: string;
}

// 가공된 일별 시세 데이터
export interface ProcessedDailyPrice {
  date: string; // YYYY-MM-DD
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  changeRate?: number;
}

// API 옵션
export interface KisStockPriceOptions {
  code: string;
  isIndex?: boolean; // 지수 여부
}

export interface KisHistoricalOptions {
  code: string;
  startDate: string; // YYYYMMDD
  endDate: string; // YYYYMMDD
  periodCode?: 'D' | 'W' | 'M'; // 일/주/월
  isIndex?: boolean;
}
