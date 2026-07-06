"""
Sierra Blue AI Real Estate Bot - Complete Implementation
Version: 2026
Purpose: Automate customer journey from inquiry to human handover
Branding: Cinematic Luxury (Investment Stakeholders, Strategic Pipeline, Portfolio Assets)
"""

import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from enum import Enum
from dataclasses import dataclass, asdict
import hashlib
import uuid

# ============================================================================
# STEP 1: DATA MODELS & ENUMS
# ============================================================================

class PortfolioAssetType(Enum):
    APARTMENT = "شقة"
    VILLA = "فيلا"
    PENTHOUSE = "بنت هاوس"
    DUPLEX = "دوبلكس"

class FurnishingLevel(Enum):
    FULLY_FURNISHED = "مفروشة بالكامل"
    SEMI_FURNISHED = "نص فرش"
    UNFURNISHED = "فاضية"

class PortfolioAssetStatus(Enum):
    AVAILABLE = "متاحة"
    TAKEN = "مؤجرة"
    PENDING = "قيد المراجعة"
    INACTIVE = "معطلة"

class BotStep(Enum):
    STEP1_GREETING = 1
    STEP2_API_CHECK = 2
    STEP3_AVAILABILITY_REPORT = 3
    STEP4_DISCOVERY_PIVOT = 4
    STEP5_SCHEDULING = 5
    STEP6_HANDOVER = 6

@dataclass
class PortfolioAsset:
    """Portfolio Asset Information Model"""
    code: str
    asset_type: PortfolioAssetType
    bedrooms: int
    furnishing_level: FurnishingLevel
    location: str
    status: PortfolioAssetStatus
    last_updated: datetime
    price: float
    image_url: Optional[str] = None
    compound_name: Optional[str] = None
    
    def to_dict(self) -> Dict:
        return {
            "code": self.code,
            "asset_type": self.asset_type.value,
            "bedrooms": self.bedrooms,
            "furnishing_level": self.furnishing_level.value,
            "location": self.location,
            "status": self.status.value,
            "last_updated": self.last_updated.isoformat(),
            "price": self.price,
            "compound_name": self.compound_name
        }

@dataclass
class StakeholderPreferences:
    """Stakeholder Requirements Model"""
    asset_type: Optional[PortfolioAssetType] = None
    bedrooms: Optional[int] = None
    furnishing_level: Optional[FurnishingLevel] = None
    location: Optional[str] = None
    compound_preference: Optional[str] = None
    near_workplace: Optional[str] = None
    near_school: Optional[str] = None
    must_haves: List[str] = None  # e.g., ["balcony", "elevator", "garden"]
    move_in_date: Optional[datetime] = None
    rental_duration_months: Optional[int] = None
    
    def __post_init__(self):
        if self.must_haves is None:
            self.must_haves = []

@dataclass
class InvestmentStakeholderProfile:
    """Complete Investment Stakeholder Profile"""
    stakeholder_id: str
    phone_number: str
    name: Optional[str] = None
    email: Optional[str] = None
    initial_inquiry_code: Optional[str] = None
    inquiry_timestamp: datetime = None
    preferences: StakeholderPreferences = None
    matched_assets: List[PortfolioAsset] = None
    scheduled_viewing: Optional[Dict] = None
    conversation_history: List[Dict] = None
    current_step: BotStep = BotStep.STEP1_GREETING
    
    def __post_init__(self):
        if self.preferences is None:
            self.preferences = StakeholderPreferences()
        if self.matched_assets is None:
            self.matched_assets = []
        if self.conversation_history is None:
            self.conversation_history = []
        if self.inquiry_timestamp is None:
            self.inquiry_timestamp = datetime.now()

# ============================================================================
# STEP 2: SYSTEM PROMPT (Bot Persona)
# ============================================================================

SIERRA_BLUE_SYSTEM_PROMPT = """أنت مستشار عقاري ذكي في شركة سييرا بلو. 

**هويتك:**
- الاسم: Sierra Blue AI Advisor
- اللغة: اللهجة المصرية الاحترافية المهذبة
- الفلسفة: ما وراء الوساطة - نحن لا نبيع، نحن نساعدك على اتخاذ القرار الأفضل

**القاعدة الذهبية:**
تحدث بصراحة تامة عن حالة الوحدات. حماية الاستشاريين والمستثمرين (Investment Stakeholders) من الوحدات الوهمية أولويتك الأولى.

**القيم الأساسية:**
1. الصدق والشفافية في كل معاملة
2. احترام وقت أصحاب المصلحة الاستثماريين (Investment Stakeholders)
3. كفاءة عالية في البحث والتوصيات ضمن محفظة الأصول (Portfolio Assets)
4. لطف واحترافية في التواصل كجزء من تجربة "Concierge"
5. الاستماع الفعال لاحتياجات أصحاب المصلحة

**نمط التواصل:**
- استخدم كلمات دافئة: "يا فندم"، "حضرتك"، "ممتاز"
- اجعل الرسائل قصيرة وسهلة الفهم
- اطرح أسئلة واحدة أو اثنتين في كل رسالة
- كن متحمساً لمساعدة العميل في رحلته الاستثمارية
"""

# ============================================================================
# STEP 3: API INTEGRATION MOCK (Replace with real APIs)
# ============================================================================

class PortfolioAssetRegistry:
    """Mock API for Portfolio Asset Integration"""
    
    def __init__(self):
        # Mock database of Portfolio Assets
        self.assets_db = {
            "SB001": PortfolioAsset(
                code="SB001",
                asset_type=PortfolioAssetType.APARTMENT,
                bedrooms=2,
                furnishing_level=FurnishingLevel.FULLY_FURNISHED,
                location="التجمع الخامس",
                status=PortfolioAssetStatus.AVAILABLE,
                last_updated=datetime.now(),
                price=15000,
                compound_name="Mountain View"
            ),
            "SB002": PortfolioAsset(
                code="SB002",
                asset_type=PortfolioAssetType.VILLA,
                bedrooms=3,
                furnishing_level=FurnishingLevel.SEMI_FURNISHED,
                location="التجمع الأول",
                status=PortfolioAssetStatus.TAKEN,
                last_updated=datetime.now() - timedelta(days=2),
                price=25000,
                compound_name="Palm Hills"
            )
        }
    
    def check_asset_availability(self, code: str) -> Tuple[Optional[PortfolioAsset], bool]:
        """
        Check if asset exists and is available
        Returns: (PortfolioAsset, is_available)
        """
        if code not in self.assets_db:
            return None, False
        
        asset_data = self.assets_db[code]
        is_available = asset_data.status == PortfolioAssetStatus.AVAILABLE
        
        return asset_data, is_available
    
    def search_assets(self, preferences: StakeholderPreferences) -> List[PortfolioAsset]:
        """Search assets matching stakeholder preferences"""
        results = []
        
        for asset in self.assets_db.values():
            # Filter by preferences
            if preferences.asset_type and asset.asset_type != preferences.asset_type:
                continue
            if preferences.bedrooms and asset.bedrooms != preferences.bedrooms:
                continue
            if preferences.furnishing_level and asset.furnishing_level != preferences.furnishing_level:
                continue
            if preferences.location and preferences.location not in asset.location:
                continue
            if asset.status != PortfolioAssetStatus.AVAILABLE:
                continue
            
            results.append(asset)
        
        return results[:3]  # Return top 3 matches

class StrategicPipeline:
    """Strategic Pipeline Integration (HubSpot/Notion equivalent)"""
    
    def __init__(self):
        self.stakeholder_registry = {}
    
    def create_stakeholder(self, profile: InvestmentStakeholderProfile) -> str:
        """Create new investment stakeholder in Strategic Pipeline"""
        profile.stakeholder_id = str(uuid.uuid4())
        self.stakeholder_registry[profile.stakeholder_id] = profile
        print(f"✓ Investment Stakeholder registered in Strategic Pipeline: {profile.stakeholder_id}")
        return profile.stakeholder_id
    
    def update_stakeholder(self, profile: InvestmentStakeholderProfile) -> bool:
        """Update existing investment stakeholder within the Strategic Pipeline"""
        if profile.stakeholder_id in self.stakeholder_registry:
            self.stakeholder_registry[profile.stakeholder_id] = profile
            print(f"✓ Strategic Pipeline updated for: {profile.stakeholder_id}")
            return True
        return False
    
    def get_stakeholder(self, stakeholder_id: str) -> Optional[InvestmentStakeholderProfile]:
        """Retrieve stakeholder from Strategic Pipeline"""
        return self.stakeholder_registry.get(stakeholder_id)

class WhatsAppConcierge:
    """WhatsApp Concierge Communication Service"""
    
    @staticmethod
    def send_message(phone_number: str, message: str, message_type: str = "text") -> bool:
        """Send WhatsApp message via Concierge channel"""
        print(f"📱 Concierge WhatsApp -> {phone_number}")
        print(f"   {message[:120]}...")
        return True
    
    @staticmethod
    def send_viewing_reminder(phone_number: str, viewing_time: str, asset_details: str) -> bool:
        """Send reminder before a scheduled viewing of a Portfolio Asset"""
        message = f"📍 تذكير من سييرا بلو: لديك موعد معاينة في {viewing_time}\n{asset_details}"
        return WhatsAppConcierge.send_message(phone_number, message)

class StrategicScheduling:
    """Google Calendar Strategic Scheduling Integration"""
    
    @staticmethod
    def create_viewing_event(event_data: Dict) -> Dict:
        """Create calendar event for Portfolio Asset viewing"""
        event_id = str(uuid.uuid4())
        print(f"📅 Strategic event created: {event_id}")
        return {
            "event_id": event_id,
            "date": event_data.get("date"),
            "time": event_data.get("time"),
            "title": event_data.get("title"),
            "location": event_data.get("location")
        }
    
    @staticmethod
    def suggest_available_slots(duration_minutes: int = 60) -> List[Dict]:
        """Suggest available time slots for stakeholder engagement"""
        suggestions = []
        base_date = datetime.now() + timedelta(days=1)
        
        for hour in [10, 14, 16]:
            suggestions.append({
                "date": base_date.strftime("%Y-%m-%d"),
                "time": f"{hour:02d}:00",
                "display": f"يوم {base_date.strftime('%A')} الساعة {hour}:00"
            })
        
        return suggestions

# ============================================================================
# STEP 4: CORE BOT LOGIC (6-Step Workflow)
# ============================================================================

class SierraBlueBot:
    """Main Bot Engine - Orchestrates entire Investment Stakeholder Journey"""
    
    def __init__(self):
        self.asset_registry = PortfolioAssetRegistry()
        self.pipeline = StrategicPipeline()
        self.concierge = WhatsAppConcierge()
        self.scheduling = StrategicScheduling()
        self.current_stakeholder = None
    
    def process_inquiry(self, phone_number: str, reference_code: str = None) -> str:
        """
        STEP 1 & 2: Greeting + Asset Check
        Entry point for stakeholder inquiry into the Strategic Pipeline
        """
        print(f"\n{'='*70}")
        print(f"STEP 1-2: 🎯 GREETING & ASSET AVAILABILITY CHECK")
        print(f"{'='*70}\n")
        
        # Create stakeholder profile
        stakeholder = InvestmentStakeholderProfile(
            stakeholder_id=None,
            phone_number=phone_number,
            initial_inquiry_code=reference_code,
            current_step=BotStep.STEP1_GREETING
        )
        
        # Register in Strategic Pipeline
        self.pipeline.create_stakeholder(stakeholder)
        self.current_stakeholder = stakeholder
        
        # Bot greeting message
        greeting = f"""أهلاً بحضرتك في سييرا بلو، مستشارك العقاري الذكي. 
ثواني هراجع محفظة الأصول حالاً عشان أتأكدلك إذا كانت الأصول دي (كود: {reference_code}) لسه متاحة ولا لأ.

وبستأذنك عقبال ما أراجع، أعرف من حضرتك: 
- ناوي تنقل إمتى بالظبط؟ 
- ومدة الإيجار المطلوبة قد إيه؟"""
        
        print("🤖 BOT:", greeting)
        stakeholder.conversation_history.append({
            "role": "bot",
            "message": greeting,
            "timestamp": datetime.now().isoformat()
        })
        
        # Step 2: Asset Check
        if reference_code:
            asset_data, is_available = self.asset_registry.check_asset_availability(reference_code)
            
            if asset_data:
                self._step3_availability_report(asset_data, is_available)
            else:
                self._asset_not_found(reference_code)
        
        return stakeholder.stakeholder_id
    
    def _step3_availability_report(self, asset_data: PortfolioAsset, is_available: bool):
        """
        STEP 3: Availability Report (Transparency & Integrity)
        """
        print(f"\n{'='*70}")
        print(f"STEP 3: 📊 PORTFOLIO ASSET STATUS REPORT")
        print(f"{'='*70}\n")
        
        status_text = "متاحة ✓" if is_available else "للأسف تم حجزها ضمن محفظة أخرى ✗"
        last_update = asset_data.last_updated.strftime("%d/%m/%Y")
        
        report = f"""شكراً لانتظارك. أنا راجعت سجلات الأصول، ووفقاً لآخر تحديث يوم {last_update}، 
الأصول دي حالياً {status_text}

**تفاصيل الأصول:**
📍 المنطقة: {asset_data.location}
🏠 النوع: {asset_data.asset_type.value}
🛏️ عدد الغرف: {asset_data.bedrooms}
🛋️ الفرش: {asset_data.furnishing_level.value}
💰 السعر: {asset_data.price:,} جنيه

وعموماً، إحنا في سييرا بلو بنعمل مسح شامل للماركت كله بالذكاء الاصطناعي، 
وكل الأصول اللي بنرشحها حقيقية 100% ونضمن جودتها لشركائنا الاستثماريين."""
        
        print("🤖 BOT:", report)
        self.current_stakeholder.conversation_history.append({
            "role": "bot",
            "message": report,
            "timestamp": datetime.now().isoformat()
        })
        
        # Move to Step 4
        self.current_stakeholder.current_step = BotStep.STEP4_DISCOVERY_PIVOT
        self._step4_discovery_pivot()
    
    def _asset_not_found(self, code: str):
        """Handle case when Portfolio Asset is not found"""
        message = f"""عذراً يا فندم، الأصول برقم {code} لم نتمكن من العثور عليها في سجلات المحفظة حالياً.
قد تكون الأصول قديمة أو الكود غير دقيق.

لكن لا تقلق! إحنا في سييرا بلو قادرين نوفر لك خيارات استثمارية أفضل من السوق كله.
تفضل، أعرفني بالتفاصيل اللي بتدور عليها؟"""
        
        print("🤖 BOT:", message)
        self.current_stakeholder.conversation_history.append({
            "role": "bot",
            "message": message,
            "timestamp": datetime.now().isoformat()
        })
        
        self.current_stakeholder.current_step = BotStep.STEP4_DISCOVERY_PIVOT
        self._step4_discovery_pivot()
    
    def _step4_discovery_pivot(self):
        """
        STEP 4: Discovery Pivot
        Transform from asset inquirer to Investment Stakeholder
        """
        print(f"\n{'='*70}")
        print(f"STEP 4: 🔄 DISCOVERY PIVOT (Strategic Qualification)")
        print(f"{'='*70}\n")
        
        pivot_message = """عشان أقدر أساعدك توصل لأفضل أصول عقارية بأحسن سعر، 
أستأذنك أعرف استراتيجيتك إيه تحديداً؟ 
هسألك كام سؤال سريع عشان السيستم يفلترلك أحسن الاختيارات من الـ Strategic Pipeline بتاعنا.

**السؤال الأول:**
بتدور على شقة ولا فيلا؟ ومحتاج كم غرفة نوم؟"""
        
        print("🤖 BOT:", pivot_message)
        self.current_stakeholder.conversation_history.append({
            "role": "bot",
            "message": pivot_message,
            "timestamp": datetime.now().isoformat()
        })
        
        self.current_stakeholder.current_step = BotStep.STEP4_DISCOVERY_PIVOT

    def collect_stakeholder_preferences(self, 
                                     asset_type: PortfolioAssetType,
                                     bedrooms: int,
                                     furnishing_level: FurnishingLevel,
                                     location: str,
                                     must_haves: List[str] = None) -> List[PortfolioAsset]:
        """
        Collect preferences from stakeholder and search for matches in the registry
        """
        print(f"\n{'='*70}")
        print(f"STEP 4: 📋 PREFERENCE ANALYSIS")
        print(f"{'='*70}\n")
        
        # Update preferences
        self.current_stakeholder.preferences = StakeholderPreferences(
            asset_type=asset_type,
            bedrooms=bedrooms,
            furnishing_level=furnishing_level,
            location=location,
            must_haves=must_haves or []
        )
        
        # Search for matching assets
        matches = self.asset_registry.search_assets(self.current_stakeholder.preferences)
        self.current_stakeholder.matched_assets = matches
        
        acknowledgment = f"""ممتاز يا فندم! فهمت متطلباتك الاستراتيجية:
✓ {asset_type.value} بـ {bedrooms} غرف نوم
✓ {furnishing_level.value}
✓ في منطقة {location}

أنا دلوقتي ببحث في المحفظة الاستثمارية... ولقيت {len(matches)} أصول عقارية مطابقة لطلبك!"""
        
        print("🤖 BOT:", acknowledgment)
        
        if matches:
            for i, asset in enumerate(matches, 1):
                print(f"\n📌 Portfolio Asset #{i}:")
                print(f"   - الموقع: {asset.location}")
                print(f"   - السعر: {asset.price:,} جنيه")
                print(f"   - الحالة: {asset.status.value}")
        
        self._step5_schedule_viewing()
        return matches
    
    def _step5_schedule_viewing(self):
        """
        STEP 5: Strategic Scheduling Automation
        """
        print(f"\n{'='*70}")
        print(f"STEP 5: 📅 SCHEDULING AUTOMATION")
        print(f"{'='*70}\n")
        
        # Get available time slots
        slots = self.scheduling.suggest_available_slots()
        
        scheduling_message = f"""ممتاز يا فندم. أنا جهزت محفظة عقارية (Portfolio) مبدئية ليك. 
السيستم بيقترح علينا نحدد ميعاد "Strategic Viewing" عشان تشوف أفضل الأصول المطابقة لطلبك في زيارة واحدة منسقة.

**الخيارات المتاحة:**
1️⃣ {slots[0]['display']}
2️⃣ {slots[1]['display']}
3️⃣ {slots[2]['display']}

إيه رأي حضرتك؟"""
        
        print("🤖 BOT:", scheduling_message)
        self.current_stakeholder.conversation_history.append({
            "role": "bot",
            "message": scheduling_message,
            "timestamp": datetime.now().isoformat()
        })
        
        self.current_stakeholder.current_step = BotStep.STEP5_SCHEDULING
    
    def confirm_viewing_appointment(self, slot_index: int):
        """
        Confirm viewing appointment and create strategic scheduling event
        """
        print(f"\n{'='*70}")
        print(f"STEP 5: ✅ ENGAGEMENT CONFIRMATION")
        print(f"{'='*70}\n")
        
        slots = self.scheduling.suggest_available_slots()
        selected_slot = slots[slot_index]
        
        # Create calendar event
        event = self.scheduling.create_viewing_event({
            "title": f"Strategic Asset Viewing - {self.current_stakeholder.phone_number}",
            "date": selected_slot["date"],
            "time": selected_slot["time"],
            "location": "سييرا بلو - مكتب التجمع"
        })
        
        self.current_stakeholder.scheduled_viewing = {
            "event_id": event["event_id"],
            "date": selected_slot["date"],
            "time": selected_slot["time"],
            "assets": [a.code for a in self.current_stakeholder.matched_assets]
        }
        
        # Update Strategic Pipeline
        self.pipeline.update_stakeholder(self.current_stakeholder)
        
        # Send WhatsApp confirmation via Concierge
        confirmation_message = f"""✅ تم تأكيد موعدكم الاستراتيجي بنجاح!

📅 **موعد المعاينة:**
التاريخ: {selected_slot['date']}
الوقت: {selected_slot['time']}

📍 **الموقع:**
سييرا بلو - مكتب التجمع الخامس (Luxury Lounge)

📱 في أي سؤال، الـ Concierge بتاعنا معاك دائماً على الواتس!"""
        
        print("🤖 BOT:", confirmation_message)
        self.concierge.send_message(self.current_stakeholder.phone_number, confirmation_message)
        
        # Move to Step 6
        self._step6_concierge_handover()
    
    def _step6_concierge_handover(self):
        """
        STEP 6: Handover to Portfolio Advisor (Human Agent)
        """
        print(f"\n{'='*70}")
        print(f"STEP 6: 🤝 PORTFOLIO ADVISOR HANDOVER")
        print(f"{'='*70}\n")
        
        # Mark stakeholder as ready for handover
        self.current_stakeholder.current_step = BotStep.STEP6_HANDOVER
        
        # Generate Stakeholder Summary
        summary = self._generate_stakeholder_summary()
        
        # Notify Advisor
        self._notify_advisor(summary)
        
        # Send final message to stakeholder
        final_message = """تم تسجيل بياناتكم الاستثمارية وحجز الموعد المبدئي. 
الـ Portfolio Advisor المتخصص بتاعنا هيراجع الاختيارات دي شخصياً 
وهيكلم حضرتك خلال ساعة بالكتير عشان يأكد معاك كل التفاصيل وخطة المعاينة الفاخرة.

يومك سعيد ونتمنى لك رحلة استثمارية مريحة مع سييرا بلو! 🎉"""
        
        print("🤖 BOT:", final_message)
        
        self.current_stakeholder.conversation_history.append({
            "role": "bot",
            "message": final_message,
            "timestamp": datetime.now().isoformat()
        })
        
        # Final update to Strategic Pipeline
        self.pipeline.update_stakeholder(self.current_stakeholder)
    
    def _generate_stakeholder_summary(self) -> Dict:
        """Generate comprehensive stakeholder profile for advisor"""
        summary = {
            "stakeholder_id": self.current_stakeholder.stakeholder_id,
            "phone_number": self.current_stakeholder.phone_number,
            "name": self.current_stakeholder.name,
            "email": self.current_stakeholder.email,
            "engagement_timestamp": self.current_stakeholder.inquiry_timestamp.isoformat(),
            "preferences": {
                "asset_type": self.current_stakeholder.preferences.asset_type.value if self.current_stakeholder.preferences.asset_type else None,
                "bedrooms": self.current_stakeholder.preferences.bedrooms,
                "furnishing_level": self.current_stakeholder.preferences.furnishing_level.value if self.current_stakeholder.preferences.furnishing_level else None,
                "location": self.current_stakeholder.preferences.location,
                "must_haves": self.current_stakeholder.preferences.must_haves
            },
            "matched_assets": [a.to_dict() for a in self.current_stakeholder.matched_assets],
            "scheduled_engagement": self.current_stakeholder.scheduled_viewing,
            "strategic_pipeline_stage": self.current_stakeholder.current_step.name
        }
        
        return summary
    
    def _notify_advisor(self, summary: Dict):
        """Send notification to human Portfolio Advisor"""
        print("\n" + "💎 "*10)
        print("⚡ STRATEGIC ALERT - NEW QUALIFIED INVESTMENT STAKEHOLDER")
        print("💎 "*10)
        print(json.dumps(summary, ensure_ascii=False, indent=2))
        print("\n✓ Portfolio Advisor will contact stakeholder within 1 hour\n")

# ============================================================================
# STEP 5: ANALYTICS & STRATEGIC INSIGHTS
# ============================================================================

class StrategicInsights:
    """Track bot performance and conversion rates for Portfolio Assets"""
    
    def __init__(self):
        self.metrics = {
            "total_engagements": 0,
            "completed_discovery": 0,
            "scheduled_viewings": 0,
            "handovers": 0,
            "conversion_rate": 0.0,
            "avg_messages_per_stakeholder": 0,
            "pipeline_abandonment": {}
        }
    
    def track_engagement(self):
        self.metrics["total_engagements"] += 1
    
    def track_handover(self, profile: InvestmentStakeholderProfile):
        self.metrics["handovers"] += 1
        if profile.scheduled_viewing:
            self.metrics["scheduled_viewings"] += 1
        
        # Calculate new average
        current_count = self.metrics["handovers"]
        new_messages = len(profile.conversation_history)
        self.metrics["avg_messages_per_stakeholder"] = (
            (self.metrics["avg_messages_per_stakeholder"] * (current_count - 1)) + new_messages
        ) / current_count
    
    def get_conversion_rate(self) -> float:
        if self.metrics["total_engagements"] == 0:
            return 0.0
        return (self.metrics["handovers"] / self.metrics["total_engagements"]) * 100
    
    def print_report(self):
        print("\n" + "="*70)
        print("📊 STRATEGIC PERFORMANCE REPORT")
        print("="*70)
        print(f"Total Strategic Engagements: {self.metrics['total_engagements']}")
        print(f"Completed Handovers to Advisors: {self.metrics['handovers']}")
        print(f"Scheduled Strategic Viewings: {self.metrics['scheduled_viewings']}")
        print(f"Pipeline Conversion Rate: {self.get_conversion_rate():.1f}%")
        print(f"Avg Messages per Stakeholder: {self.metrics['avg_messages_per_stakeholder']:.1f}")
        print("="*70 + "\n")

# ============================================================================
# STEP 6: USAGE EXAMPLE
# ============================================================================

if __name__ == "__main__":
    print("\n" + "█"*70)
    print("🏢 SIERRA BLUE AI ADVISOR - STRATEGIC WORKFLOW DEMONSTRATION")
    print("█"*70)
    
    # Initialize bot and strategic insights
    bot = SierraBlueBot()
    insights = StrategicInsights()
    
    # Simulate stakeholder engagement
    print("\n" + "🎯 "*15)
    print("SIMULATING INVESTMENT STAKEHOLDER ENGAGEMENT...")
    print("🎯 "*15)
    
    # Step 1-2: Process inquiry with reference code
    insights.track_engagement()
    stakeholder_id = bot.process_inquiry(
        phone_number="+201001234567",
        reference_code="SB001"
    )
    
    # Simulate stakeholder response with preferences
    print("\n" + "📝 "*15)
    print("STAKEHOLDER PROVIDES STRATEGIC PREFERENCES...")
    print("📝 "*15)
    
    matched = bot.collect_stakeholder_preferences(
        asset_type=PortfolioAssetType.APARTMENT,
        bedrooms=2,
        furnishing_level=FurnishingLevel.FULLY_FURNISHED,
        location="التجمع",
        must_haves=["balcony", "elevator"]
    )
    
    # Step 5: Confirm viewing appointment
    print("\n" + "⏰ "*15)
    print("STAKEHOLDER SELECTS STRATEGIC TIME SLOT...")
    print("⏰ "*15)
    
    bot.confirm_viewing_appointment(slot_index=0)
    
    # Track handover
    insights.track_handover(bot.current_stakeholder)
    
    # Print insights report
    insights.print_report()
    
    # Print final stakeholder profile
    print("\n" + "="*70)
    print("📋 FINAL STAKEHOLDER PROFILE (Ready for Portfolio Advisor Handoff)")
    print("="*70)
    print(json.dumps(
        bot._generate_stakeholder_summary(),
        ensure_ascii=False,
        indent=2
    ))
